from django.db import transaction
from rest_framework import serializers

from back.models.invoice import Invoice, InvoiceStatus, fixed_values
from back.models.invoicing_month import InvoicingMonth
from back.models.member import Member


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta(object):
        model = Member
        fields = "__all__"

    num_socio = serializers.ReadOnlyField()

    @transaction.atomic
    def create(self, validated_data):
        orden = validated_data["orden"]
        members_to_update = Member.objects.filter(orden__gte=orden)
        for member in members_to_update:
            member.orden = member.orden + 1
            member.save()
        return Member.objects.create(**validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        if instance.orden != validated_data["orden"]:
            self.update_other_members_order(instance.orden, validated_data["orden"])

        updated_member = super().update(instance, validated_data)

        self.update_current_invoice(updated_member)
        return updated_member

    def update_other_members_order(self, old_order, new_order):
        if old_order != new_order:
            if old_order < new_order:
                members_to_update = Member.objects.filter(
                    orden__gt=old_order, orden__lte=new_order
                )
                for member in members_to_update:
                    member.orden = member.orden - 1
                    member.save()
            else:
                members_to_update = Member.objects.filter(
                    orden__lt=old_order, orden__gte=new_order
                )
                for member in members_to_update:
                    member.orden = member.orden + 1
                    member.save()

    def update_current_invoice(self, member):
        last_invoicing_month = InvoicingMonth.objects.filter(is_open=True).first()
        last_invoice = Invoice.objects.filter(
            member=member.num_socio,
            mes_facturacion=last_invoicing_month.id_mes_facturacion,
            is_active=True,
        ).first()
        if last_invoice and last_invoice.estado == InvoiceStatus.NUEVA:
            last_invoice.nombre = member.name
            last_invoice.sector = member.sector
            if last_invoice.caudal_actual is not None:
                last_invoice.update_total()
            last_invoice.save()


class MemberShortSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "num_socio",
            "name",
            "sector",
            "solo_mecha",
            "consumo_maximo",
            "consumo_reduccion_fija",
        ]


class MemberExportSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Member
        fields = [
            "id",
            "name",
            "num_socio",
            "orden",
            "sector",
            "lectura_anterior",
            "lectura",
            "consumo_calculado",
            "tarifa_calculada",
            "medidor",
            "cambio_medidor",
            "cuota_fija",
            "comision",
            "ahorro",
        ]

    id = serializers.SerializerMethodField()
    num_socio = serializers.ReadOnlyField()
    lectura_anterior = serializers.SerializerMethodField()
    lectura = serializers.SerializerMethodField()
    consumo_calculado = serializers.SerializerMethodField()
    tarifa_calculada = serializers.SerializerMethodField()
    cambio_medidor = serializers.SerializerMethodField()
    cuota_fija = serializers.SerializerMethodField()
    comision = serializers.SerializerMethodField()
    ahorro = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.num_socio

    def get_lectura_anterior(self, obj):
        last_monthly_invoices = self.context.get("last_monthly_invoices", None)
        if last_monthly_invoices is None:
            return None
        last_invoice_for_member = [
            invoice
            for invoice in last_monthly_invoices
            if invoice.member.num_socio == obj.num_socio
        ]
        if last_invoice_for_member:
            # si no tenemos caudal actual es porque las facturas todavía no tienen lecturas
            # en ese caso, la lectura anterior la sacaremos del caudal_anterior porque ya está actualizado
            return (
                last_invoice_for_member[0].caudal_actual
                or last_invoice_for_member[0].caudal_anterior
            )
        # si no tiene factura anterior se trata de un nuevo socio, por tanto su consumo anterior es 0
        return 0

    def get_lectura(self, obj):
        return None

    def get_consumo_calculado(self, obj):
        return None

    def get_tarifa_calculada(self, obj):
        return None

    def get_cambio_medidor(self, obj):
        return False

    def get_cuota_fija(self, obj):
        return (
            fixed_values["CUOTA_FIJA_SOLO_MECHA"]
            if obj.solo_mecha
            else fixed_values["CUOTA_FIJA_NORMAL"]
        )

    def get_comision(self, obj):
        return fixed_values["COMISION"]

    def get_ahorro(self, obj):
        return (
            fixed_values["AHORRO_MANO_DE_OBRA_SOLO_MECHA"]
            if obj.solo_mecha
            else fixed_values["AHORRO_MANO_DE_OBRA_NORMAL"]
        )
