import pytest

from app.models.invoice_status import InvoiceStatus
from app.models.invoicing_month import InvoicingMonth
from app.models.payment import Payment
from app.tests.factories import InvoiceFactory


pytestmark = pytest.mark.django_db


def test_payment(api_client, create_invoicing_month):
    invoicing_month: InvoicingMonth = create_invoicing_month(
        anho="2019", mes="09", is_open=True,
    )
    invoice1 = InvoiceFactory.create(
        estado=InvoiceStatus.PENDIENTE_DE_COBRO,
        total=10,
        mes_facturacion=invoicing_month,
    )
    invoice2 = InvoiceFactory.create(
        estado=InvoiceStatus.PENDIENTE_DE_COBRO,
        total=20,
        mes_facturacion=invoicing_month,
    )
    payload = [
        {"fecha": "2019-09-01", "monto": 10, "invoice": invoice1.id},
        {"fecha": "2019-09-02", "monto": 15, "invoice": invoice2.id},
    ]

    response = api_client.post(
        f"/api/invoicingmonths/{invoicing_month.id_mes_facturacion}/payments/", payload,
    )
    assert response.status_code == 201, response.content
    assert Payment.objects.count() == 2
    invoice1.refresh_from_db()
    invoice2.refresh_from_db()
    assert invoice1.deuda == 0
    assert invoice2.deuda == 5
    assert Payment.objects.get(pk=1).monto == payload[0]["monto"]
