from django.urls import include, path
from rest_framework import routers

from . import api


router = routers.DefaultRouter(trailing_slash=False)
router.register(r"users", api.UserViewSet)
router.register(r"groups", api.GroupViewSet)

urlpatterns = [path("", include(router.urls))]
