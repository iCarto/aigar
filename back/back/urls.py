from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from back.views.domain import DomainsView
from back.views.invoice import InvoiceStatsView, InvoiceViewSet
from back.views.invoicing_month import InvoicingMonthViewSet
from back.views.measurement import MeasurementInvoicePreview, MeasurementViewSet
from back.views.member import MemberExportView, MemberViewSet
from back.views.payment import PaymentInvoicePreview, PaymentViewSet
from rest_framework import routers
from rest_framework_extensions import routers


class NestedDefaultRouter(routers.NestedRouterMixin, routers.DefaultRouter):
    pass


admin.autodiscover()

router = NestedDefaultRouter()
router.register(r"members", MemberViewSet, basename="member")

invoices_router = router.register(r"invoices", InvoiceViewSet, basename="invoice")
invoices_router.register(
    r"payments",
    PaymentViewSet,
    basename="invoice-payments",
    parents_query_lookups=["factura"],
)

invoicingmonths_router = router.register(
    r"invoicingmonths", InvoicingMonthViewSet, basename="invoicingmonth"
)
invoicingmonths_router.register(
    r"invoices",
    InvoiceViewSet,
    basename="invoicingmonth-invoices",
    parents_query_lookups=["mes_facturacion"],
)
invoicingmonths_router.register(
    r"measurements",
    MeasurementViewSet,
    basename="invoicingmonth-measurements",
    parents_query_lookups=["mes_facturacion"],
)
invoicingmonths_router.register(
    r"payments",
    PaymentViewSet,
    basename="invoicingmonth-payments",
    parents_query_lookups=["mes_facturacion"],
)


urlpatterns = [
    # The following SPA settings are handled in Django-SPA
    # - everything not matched in Django's urlpatterns goes to /
    # - index.html served on /
    # - all /static/... files served on /...
    # Django REST Framework urls
    path("api/", include(router.urls)),
    path(
        "api/invoicingmonths/<str:pk>/measurements/previewinvoices",
        MeasurementInvoicePreview.as_view(),
    ),
    path(
        "api/invoicingmonths/<str:pk>/payments/previewinvoices",
        PaymentInvoicePreview.as_view(),
    ),
    path("api/members/export", MemberExportView.as_view()),
    path("api/invoices/stats", InvoiceStatsView.as_view()),
    path("api/domains/<str:entity>", DomainsView.as_view()),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    # other views still work too
    path("admin/", admin.site.urls),
]

if settings.DEPLOYMENT == "dev":
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
