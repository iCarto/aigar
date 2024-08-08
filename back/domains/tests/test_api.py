import pytest
from rest_framework import status

from domains.models import aigar_config
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
    reading_days = [row.pop("reading_day") for row in response_payload]
    assert all(1 <= m <= 31 for m in reading_days)
    assert response_payload == [
        {"long_name": "Mi comunidad 1", "name": "Comunidad 1"},
        {"long_name": "Mi comunidad 2", "name": "Comunidad 2"},
    ]


def test_aigar_config_api(api_client):
    aigar_config.AigarConfig().get_solo()
    response = api_client.get("/api/domains/aigarconfig/")
    assert response.status_code == status.HTTP_200_OK, response.json()
    response_data = response.json()[0]
    assert response_data["payment_method"] == "BANCO .... Cuenta No: .... "
    assert response_data["name"] == "Junta de Agua"
