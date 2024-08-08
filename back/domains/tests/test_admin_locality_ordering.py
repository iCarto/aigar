import re

from django.urls import reverse

from domains.tests import factories


# https://til.simonwillison.net/django/testing-django-admin-with-pytest


def test_locality_admin_ordering(admin_client):
    factories.LocalityFactory.create(name="Locality 2", short_name="Loc 2")
    factories.LocalityFactory.create(name="Locality 1", short_name="Loc 1")
    factories.LocalityFactory.create(name="Locality 3", short_name="Loc 3")

    url = reverse("admin:domains_locality_changelist")

    response = admin_client.get(url)
    response_str = response.content.decode("utf-8")

    assert "Locality 1" in response_str
    assert "Locality 2" in response_str
    assert "Locality 3" in response_str

    # Check that the localities are in the correct order
    assert re.search(
        r"Locality 2.*Locality 1.*Locality 3", response_str, re.MULTILINE | re.DOTALL
    )
