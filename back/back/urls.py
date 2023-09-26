from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from app.urls import router
from app.views.invoice import InvoiceStatsView
from app.views.measurement import MeasurementInvoicePreview
from app.views.member import MemberExportView
from app.views.payment import PaymentInvoicePreview
from domains import urls as domains_urls


admin.autodiscover()


urlpatterns = [
    # The following SPA settings are handled in Django-SPA
    # - everything not matched in Django's urlpatterns goes to /
    # - index.html served on /
    # - all /static/... files served on /...
    # Django REST Framework urls
    path("api/", include(router.urls)),
    path(
        "api/invoicingmonths/<str:pk>/measurements/previewinvoices/",
        MeasurementInvoicePreview.as_view(),
    ),
    path(
        "api/invoicingmonths/<str:pk>/payments/previewinvoices/",
        PaymentInvoicePreview.as_view(),
    ),
    path("api/members/export/", MemberExportView.as_view()),
    path("api/invoices/stats/", InvoiceStatsView.as_view()),
    # path("api/domains/<str:entity>", DomainsView.as_view()),
    path("api/domains/", include(domains_urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    # other views still work too
    path("gestion/", admin.site.urls),
]


if settings.DEBUG:
    import debug_toolbar  # noqa: WPS433

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
