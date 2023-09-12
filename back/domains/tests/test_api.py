import pytest

from domains.tests import factories


pytestmark = pytest.mark.django_db


def test_zone_api(api_client):
    factories.ZoneFactory.create(
        locality__name="Mi comunidad 1", locality__short_name="Comunidad 1", code=None
    )
    factories.ZoneFactory.create(
        locality__name="Mi comunidad 2", locality__short_name="Comunidad 2", code=None
    )
    response = api_client.get("/api/domains/zones/")

    assert response.status_code == 200
    response_payload = response.json()
    measuring_days = [row.pop("measuring_day") for row in response_payload]
    assert all((1 <= m <= 31 for m in measuring_days))
    assert response_payload == [
        {"long_name": "Mi comunidad 1", "name": "Comunidad 1"},
        {"long_name": "Mi comunidad 2", "name": "Comunidad 2"},
    ]
