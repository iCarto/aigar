import re
from typing import Any

from django.core import exceptions
from django.db import models, transaction

from app.models.invoice import Invoice
from back.fields import RangedIntegerField
from domains.models import aigar_config
from domains.models.member_status import MemberStatus
from domains.models.zone import Zone


class UseTypes(models.TextChoices):
    HUMANO = "Humano", "Humano"  # noqa: WPS115
    COMERCIAL = "Comercial", "Comercial"  # noqa: WPS115


class MemberManager(models.Manager["Member"]):
    @transaction.atomic
    def create(self, **kwargs: Any) -> "Member":
        selected_fee_value = kwargs.pop("selected_fee_value", None)
        instance = super().create(**kwargs)
        d = aigar_config.get_config_nuevo_derecho(instance)
        Invoice.objects.handle_invoices_for_new_members(instance, d, selected_fee_value)
        return instance

    def active(self) -> models.QuerySet:
        return self.filter(status=MemberStatus.ACTIVE)

    def update_order(self, new_order: int | None, old_order: int | None = None) -> None:
        if old_order == new_order:
            return

        if new_order is None:
            # status has changed to DELETED
            filter_ = models.Q(orden__gt=old_order)
            update = models.F("orden") - 1
            Member.objects.select_for_update().filter(filter_).update(orden=update)
            return

        if not Member.objects.filter(orden=new_order).exists():
            return

        if old_order:
            # update Member
            if old_order < new_order:
                filter_ = models.Q(orden__gt=old_order, orden__lte=new_order)
                update = models.F("orden") - 1
            else:
                filter_ = models.Q(orden__lt=old_order, orden__gte=new_order)
                update = models.F("orden") + 1
        else:
            # create Member
            filter_ = models.Q(orden__gte=new_order)
            update = models.F("orden") + 1

        Member.objects.select_for_update().filter(filter_).update(orden=update)

    def update_status(self, pks: list[int], status: str):
        for pk in pks:
            member = self.get(id=pk)
            member.update_status(status)


class Member(models.Model):
    # El número de socio es no editable por el usuario, y se calcula automáticamente.
    # El número de socio es "único", no se reutilizan números ya usados. Pero se permite
    # el "traspaso". Es decir dar un "número de socio" / "derecho de consumo" a otro
    # usuario.

    class Meta(object):
        verbose_name = "socio"
        verbose_name_plural = "socios"
        ordering = ("id",)

    objects: MemberManager = MemberManager()

    id = models.AutoField(
        primary_key=True,
        verbose_name="Número Socio",
        help_text="El Número de socio no puede estar vacío y no debe repetirse",
    )

    # No deberían darse nombres iguales, pero puede tener sentido permitirlo
    name = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=False,
        verbose_name="Nombre",
        help_text="",
    )

    medidor = models.CharField(
        max_length=30,
        null=True,
        blank=True,
        default="",
        verbose_name="Medidor",
        help_text="",
    )

    # TODO: Deberíamos poder fijar un orden máximo igual al número de socios activos
    # TODO: #4228
    orden = RangedIntegerField(
        null=True,
        blank=True,
        default=0,
        min_value=0,
        max_value=1000,
        verbose_name="Orden del Recorrido",
        help_text="",
    )
    observaciones = models.TextField(
        null=True, blank=True, default="", verbose_name="Observaciones", help_text=""
    )

    consumo_maximo = models.PositiveSmallIntegerField(
        null=True, blank=True, verbose_name="Consumo Máximo", help_text=""
    )
    consumo_reduccion_fija = models.PositiveSmallIntegerField(
        null=True, blank=True, verbose_name="Reducción Fija de Consumo", help_text=""
    )

    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Fecha última modificación"
    )

    personas_acometida = models.IntegerField(
        blank=True,
        null=True,
        help_text="Número de personas que habitan en la casa/acometida que está formada por una o varias familias",
    )

    dui = models.CharField(
        blank=True, null=True, max_length=10, help_text="Documento Único de Identidad"
    )

    tipo_uso = models.CharField(
        blank=False,
        null=False,
        max_length=20,
        choices=UseTypes.choices,
        help_text="Tipo de uso: Humano o Comercial",
    )

    status = models.TextField(
        null=False,
        blank=False,
        choices=MemberStatus.choices,
        verbose_name="tipo de socia",
        editable=False,
        default=MemberStatus.ACTIVE,
        help_text="",
    )

    sector = models.ForeignKey(
        Zone,
        on_delete=models.RESTRICT,
        to_field="name",
        blank=False,
        null=False,
        verbose_name="sector / comunidad",
    )

    def __str__(self):
        return f"{self.id} - {self.name}"

    @transaction.atomic
    def save(self, **kwargs) -> None:
        self.full_clean()
        current_order = self._get_current_values()["orden"]
        new_order = kwargs.get("updated_fields", {}).get("orden", self.orden)
        Member.objects.update_order(new_order=new_order, old_order=current_order)
        super().save(**kwargs)

        Invoice.objects.member_updated(self)

    @property
    def lectura_anterior(self):
        last_invoice = (
            Invoice.objects.filter(mes_facturacion__is_open=True)
            .values_list("caudal_actual", "caudal_anterior")
            .filter(member_id=self.id)
            .first()
        )
        if not last_invoice:
            # si no tiene factura anterior se trata de un nuevo socio, por tanto su consumo anterior es 0
            return 0

        # si no tenemos caudal actual es porque las facturas todavía no tienen lecturas
        # en ese caso, la lectura anterior la sacaremos del caudal_anterior porque ya está actualizado
        return last_invoice[0] or last_invoice[1]

    def clean(self):
        if self.status == MemberStatus.DELETED:
            # No se puede mofificar una socia eliminada. Pero el workaround es para que
            # cuando nos llega un cambio de status a Eliminada si se pueda hacer.
            current_status = self._get_current_values()["status"]
            if current_status == MemberStatus.DELETED:
                raise exceptions.ValidationError(
                    {
                        exceptions.NON_FIELD_ERRORS: "No se puede modificar una socia eliminada"
                    }
                )
        if self.dui and not re.match(r"^\d{8}-\d$", self.dui):
            raise exceptions.ValidationError(
                {"dui": "El campo DUI debe tener el formato 'dddddddd-d'."}
            )

        if self.orden is None and self.status != MemberStatus.DELETED:
            raise exceptions.ValidationError(
                {"orden": "El campo orden sólo puede ser nulo para socias eliminadas'."}
            )

    @transaction.atomic
    def update_status(self, status) -> None:
        if status == self.status:
            return
        self.status = status
        if self.status == MemberStatus.DELETED:
            Invoice.objects.handle_invoices_for_new_deleted_members(self)
            self.orden = None
        if self.status == MemberStatus.INACTIVE:
            Invoice.objects.handle_invoices_for_new_inactive_members(self)
        if self.status == MemberStatus.ACTIVE:
            Invoice.objects.handle_invoices_for_re_active_members(self)

        self.save()

    def _get_current_values(self):
        try:
            return Member.objects.values("status", "orden").get(pk=self.pk)
        except self.DoesNotExist:
            # This handles import-export plugin, that sets the pk itself, even
            # if the row does not already exists.
            return {"status": None, "orden": None}
