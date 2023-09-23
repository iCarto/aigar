from unittest.mock import patch

import pytest

from app.models.invoice import Invoice, InvoiceStatus
from app.tests.factories import InvoiceFactory, InvoicingMonthFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


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


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_invoice_with_reconnect_debt(_, api_client, create_invoicing_month):
    old_invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NO_COBRADA,
        total=100,
        pago_11_al_30=50,
        member__status=MemberStatus.INACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=False),
    )
    create_invoicing_month(anho="2019", mes="10", is_open=True)
    member_pk = old_invoice.member.pk
    api_client.put(f"/api/members/{member_pk}/status/", {"status": MemberStatus.ACTIVE})
    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 11})
    assert response.status_code == 201, response.json()
    invoice = Invoice.objects.get(anho=2019, mes_facturado=11)
    assert invoice.reconexion == 10
    assert invoice.deuda == 0
    assert invoice.mora == 1
    assert invoice.saldo_pendiente == 50
