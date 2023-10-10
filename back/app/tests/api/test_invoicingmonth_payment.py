from unittest.mock import patch

import pytest
from django.forms import model_to_dict
from rest_framework import status

from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoicing_month import InvoicingMonth
from app.models.payment import Payment
from app.tests.factories import InvoiceFactory, InvoicingMonthFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


# @patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_payment(api_client, create_invoicing_month):
    invoicing_month: InvoicingMonth = create_invoicing_month(
        anho="2019", mes="09", is_open=True
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
        {"fecha": "2019-09-01", "monto": 10, "invoice_id": invoice1.id},
        {"fecha": "2019-09-02", "monto": 20, "invoice_id": invoice2.id},
    ]

    response = api_client.post(
        f"/api/invoicingmonths/{invoicing_month.id_mes_facturacion}/payments/", payload
    )
    assert response.status_code == 201, response.content
    assert Payment.objects.count() == 1
    assert model_to_dict(Payment.objects.get(pk=1)) == payload[0]
