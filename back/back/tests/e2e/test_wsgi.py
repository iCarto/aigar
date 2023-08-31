import pytest
from django.test import RequestFactory
from django.urls import Resolver404

from back.wsgi import application


def test_wsgi_handles_request(rf: RequestFactory):
    with pytest.raises(Resolver404):
        application.resolve_request(rf.get("/"))
