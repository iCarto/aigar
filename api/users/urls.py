from django.conf.urls import include, url

from rest_framework import routers

from . import api


router = routers.DefaultRouter(trailing_slash=False)
router.register(r"users", api.UserViewSet)
router.register(r"groups", api.GroupViewSet)

urlpatterns = [url(r"^", include(router.urls))]
