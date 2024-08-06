import factory
import pytest
from rest_framework.test import APIClient


@pytest.hookimpl(hookwrapper=True)
def pytest_runtestloop(session):  # noqa: ARG001
    # https://stackoverflow.com/questions/45773954
    with factory.Faker.override_default_locale("es"):
        yield


@pytest.fixture()
def api_client():
    return APIClient()
