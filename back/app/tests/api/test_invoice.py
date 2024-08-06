from unittest.mock import patch

import pytest
from django.forms import model_to_dict
from rest_framework import status

from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.tests.factories import InvoiceFactory, InvoicingMonthFactory, MemberFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


@pytest.fixture()
def _mock_any_payments_for():
    with patch("app.models.invoicing_month.any_payments_for", return_value=True):
        yield


def test_api_can_not_change_status(api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    invoice = InvoiceFactory.create(
        mes_facturacion=invoicingmonth, estado=InvoiceStatus.NUEVA
    )

    response = api_client.patch(
        f"/api/invoices/{invoice.pk}/", {"estado": InvoiceStatus.COBRADA}
    )

    # El endpoint no devuelve error aunque el campo es ignorado por ser no editable
    assert response.status_code == 200, response.content
    invoice.refresh_from_db()
    assert invoice.estado == InvoiceStatus.NUEVA


def test_update_invoice_status(api_client, create_invoicing_month):
    invoicing_month = create_invoicing_month(anho="2019", mes="09", is_open=False)
    invoices = [
        InvoiceFactory.create(
            estado=InvoiceStatus.NUEVA, mes_facturacion=invoicing_month
        )
        for i in range(3)
    ]

    response = api_client.put(
        "/api/invoices/status/",
        {
            "pks": [i.pk for i in invoices[:2]],
            "status": InvoiceStatus.PENDIENTE_DE_COBRO,
        },
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT, response.json()

    [i.refresh_from_db() for i in invoices]
    assert all(i.estado == InvoiceStatus.PENDIENTE_DE_COBRO for i in invoices[:2])
    assert all(i.estado == InvoiceStatus.NUEVA for i in invoices[2:])


@pytest.mark.usefixtures("_mock_any_payments_for")
def test_invoice_with_reconnect_debt(api_client, create_invoicing_month):
    old_invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NO_COBRADA,
        total=100,
        late_payment=50,
        member__status=MemberStatus.INACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=False),
    )
    create_invoicing_month(anho="2019", mes="10", is_open=True)
    member_pk = old_invoice.member.pk
    api_client.put(
        "/api/members/status/", {"pks": [member_pk], "status": MemberStatus.ACTIVE}
    )
    response = api_client.post("/api/invoicingmonths/", {"anho": "2019", "mes": "11"})
    assert response.status_code == 201, response.json()
    invoice = Invoice.objects.get(anho="2019", mes="11")
    assert invoice.reconexion == 10
    assert invoice.deuda == 0
    assert invoice.mora == 1
    assert invoice.saldo_pendiente == 50


def test_total_endpoint(api_client, create_invoicing_month):
    invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True)
    )

    sanity_check = {key: getattr(invoice, key) for key in ("total", "asamblea")}
    assert sanity_check == {"total": 6.25, "asamblea": 0}, "Check arrange data is ok"

    response = api_client.put(
        f"/api/invoices/{invoice.id}/total/", model_to_dict(invoice) | {"asamblea": 2}
    )
    response_data = response.json()
    assert response.status_code == status.HTTP_200_OK, response_data
    expected = {key: response_data[key] for key in ("total", "asamblea")}
    assert expected == {
        "total": 8.25,
        "asamblea": 2,
    }, f"JSON Response has bad values, {response_data}"
    invoice.refresh_from_db()
    assert sanity_check == {
        "total": 6.25,
        "asamblea": 0,
    }, "DB Invoice has been modified"


def test_invoice_total_zero_when_consumo_below_reduccion_fija(create_invoicing_month):
    member = MemberFactory.create(consumo_reduccion_fija=20)
    invoicing_month = create_invoicing_month(anho="2023", mes="05", is_open=True)
    invoice = InvoiceFactory.create(
        member=member,
        mes_facturacion=invoicing_month,
        caudal_anterior=100,
        caudal_actual=115,
        estado=InvoiceStatus.NUEVA,
    )

    invoice.update_total()
    invoice.save()
    invoice.refresh_from_db()

    # Assert that the total is 0
    assert invoice.total == 0, f"Expected total to be 0, but got {invoice.total}"


def test_invoice_total_more_than_zero_when_consumo_above_reduccion_fija(
    create_invoicing_month,
):
    member = MemberFactory.create(consumo_reduccion_fija=20)
    invoicing_month = create_invoicing_month(anho="2023", mes="05", is_open=True)

    # Create another invoice with caudal_anterior = 115 and caudal_actual = 140 (consumo = 25)
    invoice = InvoiceFactory.create(
        member=member,
        mes_facturacion=invoicing_month,
        caudal_anterior=115,
        caudal_actual=140,
        estado=InvoiceStatus.NUEVA,
    )

    # Update the invoice total
    invoice.update_total()
    invoice.save()

    # Refresh the invoice from the database
    invoice.refresh_from_db()

    assert (
        invoice.total > 0
    ), f"Expected total to be greater than 0, but got {invoice.total}"
