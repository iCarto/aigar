from rest_framework import routers

from app.views.invoice import InvoiceViewSet
from app.views.invoicing_month import InvoicingMonthViewSet
from app.views.invoicing_month_invoices import InvoicingMonthInvoicesViewSet
from app.views.measurement import MeasurementViewSet
from app.views.member import MemberExportViewSet, MemberViewSet
from app.views.payment import PaymentViewSet


router = routers.DefaultRouter()
router.register("members/export", MemberExportViewSet, "member-export")
router.register("members", MemberViewSet, basename="member")
router.register("invoices", InvoiceViewSet, basename="invoice")
router.register("invoicingmonths", InvoicingMonthViewSet, basename="invoicingmonth")

# https://browniebroke.com/blog/nested-viewsets-with-django-rest-framework/
# https://www.moesif.com/blog/technical/api-design/REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/
router.register(
    "invoicingmonths/(?P<mes_facturacion_id>[^/.]+)/invoices",
    InvoicingMonthInvoicesViewSet,
    basename="invoicingmonth-invoices",
)

# invoices_router.register(
#     "payments",
#     PaymentViewSet,
#     basename="invoice-payments",
#     parents_query_lookups=["factura"],
# )


# invoicingmonths_router.register(
#     "measurements",
#     MeasurementViewSet,
#     basename="invoicingmonth-measurements",
#     parents_query_lookups=["mes_facturacion"],
# )
# invoicingmonths_router.register(
#     "payments",
#     PaymentViewSet,
#     basename="invoicingmonth-payments",
#     parents_query_lookups=["mes_facturacion"],
# )
