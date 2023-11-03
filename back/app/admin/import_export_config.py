from import_export import resources, widgets
from import_export.fields import Field

from app.models.invoice import Invoice
from app.models.member import Member
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


class MemberResource(resources.ModelResource):
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

    # def after_import_row(self, row, row_result, **kwargs):
    #     if not getattr(row_result.original, "num_socio"):
    #         raise Error


class InvoiceResource(resources.ModelResource):
    class Meta(object):
        model = Invoice
        exclude = (
            "version",
            "estado",
            "member",
            "mes_facturacion",
            "created_at",
            "updated_at",
        )
        import_id_fields = ("num_socio",)

    num_socio = Field(attribute="member_id", column_name="num_socio")
