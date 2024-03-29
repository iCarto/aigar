from django.urls import include, path
from rest_framework import routers

from domains import views


router = routers.DefaultRouter()
router.register("zones", views.ZoneViewSet)
router.register("aigarconfig", views.AigarConfigViewSet)


urlpatterns = [
    path("estados/", views.invoice_status_view),
    path("", include(router.urls)),
]
