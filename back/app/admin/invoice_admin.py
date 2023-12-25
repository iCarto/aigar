from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from app.admin.import_export_config import InvoiceResource
from app.models.invoice import Invoice


@admin.register(Invoice)
class InvoiceAdmin(ImportExportModelAdmin):
    resource_classes = (InvoiceResource,)
    search_fields = ("=member__id", "member__name")
    search_help_text = "Busqueda por nombre o número de socio/a"
    list_display = ("numero", "mes_facturacion_id", "member", "total", "estado")
    readonly_fields = ("mes_facturacion_id",)
    list_select_related = True
    list_filter = ("estado", "anho", "mes")
    list_max_show_all = 10
    ordering = ("-mes_facturacion_id", "id")
