# https://stackoverflow.com/questions/45773954

import factory
import pytest


@pytest.hookimpl(hookwrapper=True)
def pytest_runtestloop(session):
    with factory.Faker.override_default_locale("es"):
        yield
