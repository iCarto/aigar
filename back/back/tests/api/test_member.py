import pytest
from django.core import exceptions
from django.forms.models import model_to_dict
from rest_framework import status

from back.models.invoice import InvoiceStatus
from back.models.member import Member
from back.tests.factories import InvoiceFactory, InvoicingMonthFactory, MemberFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


def test_delete_member_not_allowed(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)
    member_pk = member.pk
    assert member.pk == 1
    assert member.num_socio == 1
    response = api_client.delete(f"/api/members/{member_pk}/")
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    expected = Member.objects.get(pk=member_pk)
    assert expected.is_active is False


def test_create_member_first_order(api_client, new_member_data):
    new_member_data["orden"] = 2
    api_client.post("/api/members/", new_member_data)
    assert Member.objects.all().count() == 1
    assert Member.objects.get(pk=1).orden == 2

    new_member_data["orden"] = 0
    api_client.post("/api/members/", new_member_data)
    assert Member.objects.all().count() == 2
    assert Member.objects.get(pk=2).orden == 0
    assert Member.objects.get(pk=1).orden == 2  # not need to increase orden


def test_create_member_not_move_preceding_order(
    api_client, five_members_in_order, new_member_data
):
    response = api_client.post("/api/members/", new_member_data)
    assert response.status_code == 201, response.json()
    for member in five_members_in_order:
        member.refresh_from_db()

    assert five_members_in_order[0].orden == 0
    assert five_members_in_order[1].orden == 1
    assert Member.objects.get(pk=response.data["num_socio"]).orden == 2


def test_create_member_move_subsequent_order(
    api_client, five_members_in_order, new_member_data
):
    response = api_client.post("/api/members/", new_member_data)
    assert response.status_code == 201, response.json()
    for member in five_members_in_order:
        member.refresh_from_db()
    five_members_in_order.insert(2, Member.objects.get(pk=response.data["num_socio"]))
    assert [m.orden for m in five_members_in_order] == [0, 1, 2, 3, 4, 5]


def test_update_member_move_preceding_order(api_client, five_members_in_order):
    d = model_to_dict(
        five_members_in_order[3], exclude=["consumo_maximo", "consumo_reduccion_fija"]
    ) | {"orden": 1}
    response = api_client.put(f"/api/members/{d['num_socio']}/", d)
    assert response.status_code == 200, response.json()
    for member in five_members_in_order:
        member.refresh_from_db()

    assert [m.orden for m in five_members_in_order] == [0, 2, 3, 1, 4]


def test_update_member_move_subsequent_order(api_client, five_members_in_order):
    d = model_to_dict(
        five_members_in_order[3], exclude=["consumo_maximo", "consumo_reduccion_fija"]
    ) | {"orden": 4}
    response = api_client.put(f"/api/members/{d['num_socio']}/", d)
    assert response.status_code == 200, response.json()
    for member in five_members_in_order:
        member.refresh_from_db()

    assert [m.orden for m in five_members_in_order] == [0, 1, 2, 4, 3]


def test_update_member_with_invoices(api_client):
    invoicing_month = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicing_month.save()
    invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        mes_facturacion=invoicing_month,
        caudal_anterior=10,
        caudal_actual=110,
    )
    invoice.update_total()
    invoice.save()
    assert invoice.total == pytest.approx(210.75)
    d = model_to_dict(
        invoice.member, exclude=["consumo_maximo", "consumo_reduccion_fija"]
    ) | {"name": "foo bar", "consumo_maximo": 15}
    response = api_client.put(f"/api/members/{d['num_socio']}/", d)
    assert response.status_code == 200
    invoice.refresh_from_db()
    assert invoice.member.name == "foo bar"
    assert invoice.total == pytest.approx(7)


def test_validate_dui(api_client):
    member = MemberFactory.create()
    d = model_to_dict(member, exclude=["consumo_maximo", "consumo_reduccion_fija"])
    d["dui"] = "abc"
    with pytest.raises(
        exceptions.ValidationError,
        match="El campo DUI debe tener el formato 'dddddddd-d'.",
    ):
        api_client.put(f"/api/members/{d['num_socio']}/", d)
