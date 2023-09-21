import pytest
from django.core import exceptions
from django.forms.models import model_to_dict
from rest_framework import status

from back.models.forthcoming_invoice_item import ForthcomingInvoiceItem
from back.models.invoice import Invoice, InvoiceStatus
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
    assert expected.status == MemberStatus.ACTIVE


def test_status_delete(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)
    member_pk = member.pk
    assert member.pk == 1
    response = api_client.put(
        f"/api/members/{member_pk}/status/", {"status": MemberStatus.DELETED}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    expected = Member.objects.get(pk=member_pk)
    assert expected.status == MemberStatus.DELETED


def _create_invoicing_month(anho: str = "2019", mes: str = "09", is_open: bool = True):
    """InvoicingMonth.create has too much logic."""
    invoicing_month = InvoicingMonth(
        anho=anho, mes=mes, is_open=is_open, id_mes_facturacion=anho + mes
    )
    invoicing_month.save()
    return invoicing_month


def test_delete_new_invoices_when_deleting_member(api_client):
    invoice9 = InvoiceFactory.create(
        estado=InvoiceStatus.COBRADA,
        mes_facturacion=_create_invoicing_month(is_open=False),
    )
    invoice10 = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        member=invoice9.member,
        mes_facturacion=_create_invoicing_month(mes="10"),
    )
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA, mes_facturacion=invoice10.mes_facturacion
    )
    member_pk = invoice10.member.pk
    response = api_client.put(
        f"/api/members/{member_pk}/status/", {"status": MemberStatus.DELETED}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Member.objects.get(pk=member_pk).status == MemberStatus.DELETED
    assert Invoice.objects.count() == 2


def test_create_reconnect_debt_when_activating_member(api_client):
    member = MemberFactory.create(status=MemberStatus.INACTIVE)

    response = api_client.put(
        f"/api/members/{member.pk}/status/", {"status": MemberStatus.ACTIVE}
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert ForthcomingInvoiceItem.objects.filter(
        member=member, item="DERECHO_RECONEXION", value=10
    ).exists()


def test_not_create_reconnect_debt_when_creating_member(api_client, new_member_data):
    response = api_client.post("/api/members/", new_member_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert not ForthcomingInvoiceItem.objects.filter(item="DERECHO_RECONEXION").exists()


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


def test_api_can_not_change_status(api_client):
    member = MemberFactory.create(status=MemberStatus.ACTIVE)

    response = api_client.patch(
        f"/api/members/{member.pk}/", {"estado": MemberStatus.INACTIVE}
    )

    # El endpoint no devuelve error aunque el campo es ignorado por ser no editable
    assert response.status_code == 200, response.content
    member.refresh_from_db()
    assert member.status == MemberStatus.ACTIVE
