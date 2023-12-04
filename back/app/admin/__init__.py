from django.conf.locale.es import formats as es_formats
from django.contrib import admin, auth

from app.models.forthcoming_invoice_item import ForthcomingInvoiceItem
from app.models.measurement import Measurement
from app.models.payment import Payment

from .invoice_admin import InvoiceAdmin
from .invoicingmonth_admin import InvoicingMonthAdmin
from .member_admin import MemberAdmin

from .admin_app_ordering import get_app_list


admin.AdminSite.get_app_list = get_app_list


admin.site.unregister(auth.models.User)
admin.site.unregister((auth.models.Group))

es_formats.DATETIME_FORMAT = "d/m/Y H:i:s"

admin.site.site_header = "Configuración de AIGAR"
admin.site.site_title = "Configuración de AIGAR"
admin.site.index_title = "Panel de configuración de AIGAR"


admin.site.register(ForthcomingInvoiceItem)


# @admin.register(Measurement)
# class MeasurementAdmin(admin.ModelAdmin):
#     list_display = (
#         "invoice_number",
#         "caudal_anterior",
#         "caudal_actual",
#         "consumo",
#         "cambio_medidor",
#     )
#     list_select_related = True
#     list_max_show_all = 10
#     ordering = ("-invoice_id", "id")

#     @admin.display(description="Número de recibo")
#     def invoice_number(self, obj):
#         return obj.invoice.numero


# @admin.register(Payment)
# class PaymentAdmin(admin.ModelAdmin):
#     list_display = ("invoice_number", "fecha", "monto")
#     list_select_related = True
#     list_max_show_all = 10
#     ordering = ("-invoice_id", "id")

#     @admin.display(description="Número de recibo")
#     def invoice_number(self, obj):
#         return obj.invoice.numero
