import datetime

from import_export import resources, widgets
from import_export.fields import Field

from app.models.invoice import Invoice
from app.models.invoicing_month import InvoicingMonth
from app.models.measurement import Measurement
from app.models.member import Member
from app.models.payment import Payment
from back.utils.dates import next_month
from domains.models.member_status import MemberStatus
from domains.models.zone import Zone


class NotNullIntegerWidget(widgets.IntegerWidget):
    def clean(self, value, row=None, **kwargs):
        result = super().clean(value, row, **kwargs)
        if not result:
            raise ValueError("El campo no puede estar vacio")
        return result


class ChoicesWidget(widgets.CharWidget):
    def __init__(self, choices: list[str], coerce_to_string=False, allow_blank=False):
        super().__init__(coerce_to_string, allow_blank)
        self.choices = choices

    def clean(self, value, row=None, **kwargs):
        result = super().clean(value, row, **kwargs)
        if result not in self.choices:
            raise ValueError(f"La opción '{result}' no es válida")
        return result


class RemoveEmptyRowsResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        # https://github.com/django-import-export/django-import-export/issues/1005
        # https://github.com/django-import-export/django-import-export/pull/1490
        filtered_dataset = [
            row for row in dataset if not all(value is None for value in row)
        ]
        return super().before_import(
            filtered_dataset, using_transactions, dry_run, **kwargs
        )


class MemberResource(RemoveEmptyRowsResource):
    class Meta(object):
        model = Member
        exclude = ("id", "sector", "created_at", "updated_at")
        import_id_fields = ("num_socio",)

    num_socio = Field(
        attribute="id", column_name="num_socio", widget=NotNullIntegerWidget()
    )
    orden = Field(attribute="orden", column_name="orden", widget=NotNullIntegerWidget())
    status = Field(
        attribute="status",
        column_name="status",
        widget=ChoicesWidget(choices=[a[0] for a in MemberStatus.choices]),
    )
    sector_name = Field(
        attribute="sector",
        column_name="sector",
        widget=widgets.ForeignKeyWidget(Zone, field="name"),
    )


class InvoiceResource(RemoveEmptyRowsResource):
    class Meta(object):
        model = Invoice
        fields = (
            "id",
            "num_socio",
            "member_name",
            "mes_facturacion",
            "caudal_anterior",
            "caudal_actual",
            "ontime_payment",
            "late_payment",
            "total",
            "observaciones",
        )
        import_id_fields = ("num_socio",)

    id = Field(attribute="id", column_name="id", widget=NotNullIntegerWidget())

    num_socio = Field(
        column_name="num_socio",
        attribute="member",
        widget=widgets.ForeignKeyWidget(Member, field="id"),
    )
    mes_facturacion = Field(
        column_name="mes_facturacion",
        attribute="mes_facturacion",
        widget=widgets.ForeignKeyWidget(InvoicingMonth, field="id_mes_facturacion"),
    )

    member_name = Field(column_name="Nombre", attribute="member__name", readonly=True)

    def after_save_instance(self, instance, using_transactions, dry_run):
        total = instance.total
        ontime_payment = instance.ontime_payment
        late_payment = instance.late_payment
        instance.ontime_payment = 0
        instance.late_payment = 0
        instance.save()
        if instance.caudal_actual:
            Measurement.objects.create(
                caudal_anterior=instance.caudal_anterior,
                caudal_actual=instance.caudal_actual,
                invoice=instance,
            )

        instance.refresh_from_db()
        instance.otros = (
            total
            - instance.cuota_fija
            - instance.cuota_variable
            - instance.ahorro
            - instance.comision
        )
        instance.total = total
        instance.save()

        if ontime_payment:
            Payment.objects.create(
                fecha=next_month(
                    datetime.date(int(instance.anho), int(instance.mes), 1)
                ),
                monto=ontime_payment,
                invoice=instance,
            )

        if late_payment:
            Payment.objects.create(
                fecha=next_month(
                    datetime.date(int(instance.anho), int(instance.mes), 28)
                ),
                monto=late_payment,
                invoice=instance,
            )

    def after_import_row(self, row, row_result, **kwargs):
        mes_facturacion_original = getattr(row_result.original, "mes_facturacion_id")
        if mes_facturacion_original != row["mes_facturacion"]:
            raise ValueError(
                f"El mes de facturacion no coincide {mes_facturacion_original}:{row['mes_facturacion']}"
            )
