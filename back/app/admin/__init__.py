from django.conf.locale.es import formats as es_formats
from django.contrib import admin, auth

from app.models.forthcoming_invoice_item import ForthcomingInvoiceItem

from .admin_app_ordering import get_app_list
from .invoice_admin import InvoiceAdmin  # noqa: F401
from .invoicingmonth_admin import InvoicingMonthAdmin  # noqa: F401
from .member_admin import MemberAdmin  # noqa: F401


admin.AdminSite.get_app_list = get_app_list


admin.site.unregister(auth.models.User)
admin.site.unregister(auth.models.Group)

es_formats.DATETIME_FORMAT = "d/m/Y H:i:s"

admin.site.site_header = "Configuración de AIGAR"
admin.site.site_title = "Configuración de AIGAR"
admin.site.index_title = "Panel de configuración de AIGAR"


admin.site.register(ForthcomingInvoiceItem)
