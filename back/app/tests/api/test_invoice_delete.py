from contextlib import nullcontext as does_not_raise
from datetime import date
from unittest.mock import patch

import pytest
from django.core import exceptions
from rest_framework import status

from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.models.measurement import Measurement
from app.models.payment import Payment
from app.tests.factories import InvoiceFactory


pytestmark = pytest.mark.django_db


def test_new_invoices_can_be_deleted(api_client, create_invoicing_month):
    invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
    )
    response = api_client.delete(f"/api/invoices/{invoice.pk}/")
    assert response.status_code == status.HTTP_200_OK, response.json()
    invoice.refresh_from_db()
    assert invoice.estado == InvoiceStatus.ANULADA


def test_new_invoice_is_created_when_old_is_deleted(api_client, create_invoicing_month):
    old_invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
    )
    response = api_client.delete(f"/api/invoices/{old_invoice.pk}/")
    assert response.status_code == status.HTTP_200_OK, response.json()
    new_invoice = Invoice.objects.get(version=2)
    assert new_invoice.estado == InvoiceStatus.NUEVA
    assert new_invoice.member == old_invoice.member


def test_measurements_are_moved(api_client, create_invoicing_month):
    old_invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
    )
    measurement = Measurement.objects.create(
        invoice=old_invoice, caudal_anterior=5, caudal_actual=10
    )
    response = api_client.delete(f"/api/invoices/{old_invoice.pk}/")
    assert response.status_code == status.HTTP_200_OK, response.json()
    old_invoice.refresh_from_db()
    assert not old_invoice.measurement_set.exists()
    new_invoice = Invoice.objects.get(version=2)
    assert new_invoice.caudal_actual == 10
    assert new_invoice.measurement_set.all()[0] == measurement


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_dont_modify_for_closed_months(_, api_client, create_invoicing_month):
    invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
    )
    response = api_client.post(
        "/api/invoicingmonths/", {"anho": "2019", "mes": "10", "is_open": True}
    )
    assert response.status_code == 201, response.json()

    invoice.refresh_from_db()
    assert not invoice.mes_facturacion.is_open
    with pytest.raises(
        exceptions.ValidationError, match="No se puede modificar una  factura en estado"
    ):
        api_client.delete(f"/api/invoices/{invoice.pk}/")


def test_dont_modify_with_payments(api_client, create_invoicing_month):
    invoice = InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
        total=10,
    )
    fecha = date(2019, 9, 1)
    Payment.objects.create(invoice=invoice, fecha=fecha, monto=1)
    with pytest.raises(
        exceptions.ValidationError,
        match="No se puede modificar una factura con pagos asociados",
    ):
        api_client.delete(f"/api/invoices/{invoice.pk}/")


@pytest.mark.parametrize(
    "estado,expectation",
    [
        (InvoiceStatus.ANULADA, pytest.raises(exceptions.ValidationError)),
        (InvoiceStatus.COBRADA, pytest.raises(exceptions.ValidationError)),
        (InvoiceStatus.NO_COBRADA, pytest.raises(exceptions.ValidationError)),
        (InvoiceStatus.NUEVA, does_not_raise()),
    ],
)
def test_dont_modify_for_state(estado, expectation, api_client, create_invoicing_month):
    with expectation:
        invoice = InvoiceFactory.create(
            estado=estado,
            mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        )
        api_client.delete(f"/api/invoices/{invoice.pk}/")
