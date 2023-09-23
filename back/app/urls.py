from rest_framework_extensions import routers

from app.views.invoice import InvoiceViewSet
from app.views.invoicing_month import InvoicingMonthViewSet
from app.views.measurement import MeasurementViewSet
from app.views.member import MemberViewSet
from app.views.payment import PaymentViewSet


class NestedDefaultRouter(routers.NestedRouterMixin, routers.DefaultRouter):
    """NestedDefaultRouter."""


router = NestedDefaultRouter()
router.register("members", MemberViewSet, basename="member")

invoices_router = router.register("invoices", InvoiceViewSet, basename="invoice")
invoices_router.register(
    "payments",
    PaymentViewSet,
    basename="invoice-payments",
    parents_query_lookups=["factura"],
)

invoicingmonths_router = router.register(
    "invoicingmonths", InvoicingMonthViewSet, basename="invoicingmonth"
)
invoicingmonths_router.register(
    "invoices",
    InvoiceViewSet,
    basename="invoicingmonth-invoices",
    parents_query_lookups=["mes_facturacion"],
)
invoicingmonths_router.register(
    "measurements",
    MeasurementViewSet,
    basename="invoicingmonth-measurements",
    parents_query_lookups=["mes_facturacion"],
)
invoicingmonths_router.register(
    "payments",
    PaymentViewSet,
    basename="invoicingmonth-payments",
    parents_query_lookups=["mes_facturacion"],
)
