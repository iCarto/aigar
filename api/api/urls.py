"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from api.views.domain import DomainsView
from api.views.invoice import InvoiceViewSet
from api.views.invoicing_month import InvoicingMonthViewSet
from api.views.measurement import MeasurementInvoicePreview, MeasurementViewSet
from api.views.member import MemberViewSet
from api.views.payment import PaymentInvoicePreview, PaymentViewSet
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
