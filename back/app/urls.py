from django.urls import include, path
from rest_framework import routers

from app.views.invoice import InvoiceViewSet
from app.views.invoicing_month import InvoicingMonthViewSet
from app.views.invoicing_month_invoices import InvoicingMonthInvoicesViewSet
from app.views.invoicing_month_payments import InvoicingMonthListPaymentsViewSet
from app.views.measurement import MeasurementViewSet
from app.views.member import MemberViewSet
from app.views.member_export import members_export
from app.views.payment import PaymentViewSet


router = routers.DefaultRouter()
router.register("members", MemberViewSet, basename="member")
router.register("invoices", InvoiceViewSet, basename="invoice")

router.register("measurements", MeasurementViewSet, basename="measurements")
router.register("payments", PaymentViewSet, basename="payment")


# https://browniebroke.com/blog/nested-viewsets-with-django-rest-framework/
# https://www.moesif.com/blog/technical/api-design/REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/

router.register("invoicingmonths", InvoicingMonthViewSet, basename="invoicingmonth")
router.register(
    "invoicingmonths/(?P<mes_facturacion_id>[^/.]+)/invoices",
    InvoicingMonthInvoicesViewSet,
    basename="invoicingmonth-invoices",
)
router.register(
    "invoicingmonths/(?P<mes_facturacion_id>[^/.]+)/payments",
    InvoicingMonthListPaymentsViewSet,
    basename="invoicingmonth-payments",
)

urlpatterns = [
    path("", include(router.urls)),
    path("members/export", members_export, name="member-export"),
]
