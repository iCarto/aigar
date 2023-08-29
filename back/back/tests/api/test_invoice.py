import pytest

from back.models.invoice import InvoiceStatus
from back.tests.factories import InvoiceFactory, InvoicingMonthFactory


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
