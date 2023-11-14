from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from app.urls import urlpatterns as api_urls
from app.views.invoice import InvoiceStatsView
from domains import urls as domains_urls


admin.autodiscover()


urlpatterns = [
    # The following SPA settings are handled in Django-SPA
    # - everything not matched in Django's urlpatterns goes to /
    # - index.html served on /
    # - all /static/... files served on /...
    # Django REST Framework urls
    path("api/invoices/stats/", InvoiceStatsView.as_view()),
    path("api/", include(api_urls)),
    path("api/domains/", include(domains_urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    # other views still work too
    path("gestion/", admin.site.urls),
]


if settings.DEBUG:
    import debug_toolbar  # noqa: WPS433

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
