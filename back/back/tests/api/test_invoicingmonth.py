from unittest.mock import MagicMock, patch

import pytest
from django.core import exceptions

from back.models.invoice import Invoice, InvoiceStatus
from back.models.invoicing_month import InvoicingMonth
from back.tests.factories import InvoiceFactory, InvoicingMonthFactory, MemberFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("no implemented jet")
def test_calculate_derecho_conextion():
    """Ejemplo de query.

    select nombre, anho, mes_facturado, derecho from back_invoice where derecho != 0 order by 1, 2, 3, 4;
    """


def test_payment_validation_raises_error(api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    with pytest.raises(
        exceptions.ValidationError,
        match="El mes anterior no ha importado ningún pago. Revise si la facturación del mes que va a cerrar está correcta.",
    ):
        api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})


@patch("back.models.invoicing_month.Payment", autospec=True)
def test_create_without_previous(mock_payment, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    InvoiceFactory.create(mes_facturacion=invoicingmonth, estado=InvoiceStatus.COBRADA)

    member = MemberFactory()

    mock_payment = MagicMock()
    mock_payment.objects = MagicMock()
    mock_payment.objects.filter = MagicMock
    mock_payment.objects.filter.count = MagicMock(return_value=1)

    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})
    assert response.status_code == 201, response.content
    assert InvoicingMonth.objects.count() == 2
    assert Invoice.objects.count() == 3
    assert Invoice.objects.filter(member=member).count() == 1
    assert Invoice.objects.filter(member=member).first().caudal_anterior == 0


@patch("back.models.invoicing_month.Payment", autospec=True)
def test_create_with_previous(mock_payment, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    InvoiceFactory.create(
        mes_facturacion=invoicingmonth,
        estado=InvoiceStatus.COBRADA,
        caudal_actual=10,
        pago_1_al_10=0,
        pago_11_al_30=1,
        total=1,
    )

    mock_payment = MagicMock()
    mock_payment.objects = MagicMock()
    mock_payment.objects.filter = MagicMock
    mock_payment.objects.filter.count = MagicMock(return_value=1)

    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})
    assert response.status_code == 201, response.content
    assert InvoicingMonth.objects.count() == 2
    assert Invoice.objects.count() == 2
    new_invoice = Invoice.objects.filter(
        anho=2019, mes_facturado=10, estado=InvoiceStatus.NUEVA
    ).last()
    assert new_invoice.caudal_anterior == 10
    assert new_invoice.mora == 1


@patch("back.models.invoicing_month.Payment", autospec=True)
def test_previous_month_is_closed_current_is_open(mock_payment, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()

    mock_payment = MagicMock()
    mock_payment.objects = MagicMock()
    mock_payment.objects.filter = MagicMock
    mock_payment.objects.filter.count = MagicMock(return_value=1)

    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})
    assert response.status_code == 201, response.content

    invoicingmonth.refresh_from_db()
    assert invoicingmonth.is_open is False
    assert InvoicingMonth.objects.filter(is_open=True).count() == 1
