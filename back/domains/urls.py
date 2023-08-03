from django.urls import include, path
from rest_framework import routers

from domains import views


router = routers.SimpleRouter()
router.register("zones", views.ZoneViewSet)

urlpatterns = [path("", include(router.urls))]
