import pytest
from django.core import exceptions
from django.forms.models import model_to_dict
from rest_framework import status

from app.models.forthcoming_invoice_item import (
    ForthcomingInvoiceItem,
    ForthcomingInvoiceItemName,
)
from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.models.measurement import Measurement
from app.models.member import Member, UseTypes
from app.tests.factories import InvoiceFactory, MemberFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


def test_delete_member_not_allowed(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)
    member_pk = member.pk
    assert member.pk == 1
    assert member.id == 1
    response = api_client.delete(f"/api/members/{member_pk}/")
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    expected = Member.objects.get(pk=member_pk)
    assert expected.status == MemberStatus.ACTIVE


def test_status_delete(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)
    member_pk = member.pk
    assert member.pk == 1
    response = api_client.put(
        "/api/members/status/", {"pks": [member_pk], "status": MemberStatus.DELETED}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    expected = Member.objects.get(pk=member_pk)
    assert expected.status == MemberStatus.DELETED


def test_delete_new_invoices_when_deleting_member(api_client, create_invoicing_month):
    invoice9 = InvoiceFactory.create(
        estado=InvoiceStatus.COBRADA,
        mes_facturacion=create_invoicing_month(is_open=False),
    )
    invoice10 = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        member=invoice9.member,
        mes_facturacion=create_invoicing_month(mes="10"),
    )
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA, mes_facturacion=invoice10.mes_facturacion
    )
    member_pk = invoice10.member.pk
    response = api_client.put(
        "/api/members/status/", {"pks": [member_pk], "status": MemberStatus.DELETED}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Member.objects.get(pk=member_pk).status == MemberStatus.DELETED
    assert Invoice.objects.count() == 2


def test_create_reconnect_debt_when_activating_member(api_client):
    member = MemberFactory.create(status=MemberStatus.INACTIVE)

    response = api_client.put(
        "/api/members/status/", {"pks": [member.pk], "status": MemberStatus.ACTIVE}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert ForthcomingInvoiceItem.objects.filter(
        member=member, item=ForthcomingInvoiceItemName.reconexion, value=10
    ).exists()


def test_not_create_reconnect_debt_when_creating_member(
    api_client, new_member_data, create_invoicing_month
):
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True)
    )
    response = api_client.post("/api/members/", new_member_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert not ForthcomingInvoiceItem.objects.filter(
        item=ForthcomingInvoiceItemName.reconexion
    ).exists()


def test_update_member_with_invoices(api_client, create_invoicing_month):
    invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        mes_facturacion=create_invoicing_month(anho=2019, mes=9, is_open=True),
        caudal_anterior=10,
        caudal_actual=110,
        member__tipo_uso=UseTypes.HUMANO,
    )
    invoice.update_total()
    invoice.save()
    Measurement(caudal_anterior=10, caudal_actual=110, invoice=invoice).save()
    assert invoice.total == pytest.approx(170.75)
    d = model_to_dict(
        invoice.member, exclude=["consumo_maximo", "consumo_reduccion_fija"]
    ) | {"name": "foo bar", "consumo_maximo": 15}
    response = api_client.put(f"/api/members/{d['id']}/", d)
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
        api_client.put(f"/api/members/{d['id']}/", d)


def test_api_can_not_change_status(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)

    response = api_client.patch(
        f"/api/members/{member.pk}/", {"estado": MemberStatus.INACTIVE}
    )

    # El endpoint no devuelve error aunque el campo es ignorado por ser no editable
    assert response.status_code == 200, response.content
    member.refresh_from_db()
    assert member.status == MemberStatus.ACTIVE
