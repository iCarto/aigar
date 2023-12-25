from unittest.mock import patch

import pytest
from django.core import exceptions

from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.models.invoicing_month import InvoicingMonth
from app.models.member import UseTypes
from app.tests.factories import InvoiceFactory, InvoicingMonthFactory, MemberFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("no implemented jet")
def test_calculate_derecho_conextion():
    """Ejemplo de query.

    select nombre, anho, mes, derecho from back_invoice where derecho != 0 order by 1, 2, 3, 4;
    """


def test_payment_validation_raises_error(api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    with pytest.raises(
        exceptions.ValidationError,
        match="El mes anterior no ha importado ningún pago. Revise si la facturación del mes que va a cerrar está correcta.",
    ):
        api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_create_without_previous(_, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    InvoiceFactory.create(mes_facturacion=invoicingmonth, estado=InvoiceStatus.COBRADA)

    member = MemberFactory()

    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})
    assert response.status_code == 201, response.content
    assert InvoicingMonth.objects.count() == 2
    assert Invoice.objects.count() == 3
    assert Invoice.objects.filter(member=member).count() == 1
    assert Invoice.objects.filter(member=member).first().caudal_anterior == 0


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_create_with_previous(_, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth.save()
    InvoiceFactory.create(
        mes_facturacion=invoicingmonth,
        estado=InvoiceStatus.COBRADA,
        caudal_actual=10,
        ontime_payment=0,
        late_payment=1,
        total=1,
    )

    response = api_client.post("/api/invoicingmonths/", {"anho": "2019", "mes": "10"})
    assert response.status_code == 201, response.content
    assert InvoicingMonth.objects.count() == 2
    assert Invoice.objects.count() == 2
    new_invoice = Invoice.objects.filter(
        anho="2019", mes="10", estado=InvoiceStatus.NUEVA,
    ).last()
    assert new_invoice.caudal_anterior == 10
    assert new_invoice.mora == 1


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_previous_month_is_closed_current_is_open(_, api_client):
    invoicingmonth = InvoicingMonthFactory.build(anho="2019", mes="09", is_open=True)
    invoicingmonth.save()

    response = api_client.post("/api/invoicingmonths/", {"anho": "2019", "mes": "10"})
    assert response.status_code == 201, response.content

    invoicingmonth.refresh_from_db()
    assert invoicingmonth.is_open is False
    assert InvoicingMonth.objects.filter(is_open=True).count() == 1


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_derecho_conexion_invoice_generation(_, api_client, create_invoicing_month):
    invoicing_month = create_invoicing_month(anho="2019", mes="09", is_open=True)
    InvoiceFactory.create(mes_facturacion=invoicing_month)
    member = MemberFactory.create(tipo_uso=UseTypes.COMERCIAL, selected_fee_value=50)

    assert Invoice.objects.filter(
        member=member, mes_facturacion=invoicing_month,
    ).values("derecho", "total", "caudal_actual", "caudal_anterior").first() == {
        "derecho": 150,
        "total": 150,
        "caudal_actual": 0,
        "caudal_anterior": 0,
    }

    year_month = ((2019, 10), (2019, 11), (2019, 12), (2020, 1), (2020, 2))
    for year, month in year_month:
        response = api_client.post(
            "/api/invoicingmonths/", {"anho": year, "mes": month},
        )
        response_data = response.json()
        invoice = Invoice.objects.get(
            member=member, mes_facturacion=response_data["id_mes_facturacion"],
        )
        assert invoice.derecho == 50
        Invoice.objects.update(caudal_actual=5)

    response = api_client.post("/api/invoicingmonths/", {"anho": "2020", "mes": "3"})
    response_data = response.json()
    invoice = Invoice.objects.get(
        member=member, mes_facturacion=response_data["id_mes_facturacion"],
    )
    assert invoice.derecho == 0


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_derecho_conexion_pay_full_fee_in_one(
    _, api_client, create_invoicing_month, new_member_data,
):
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
    )

    member_data = new_member_data | {"selected_fee_value": 300}
    response = api_client.post("/api/members/", member_data)
    assert response.status_code == 201, response.json()
    member_id = response.json()["id"]
    invoice = Invoice.objects.get(member_id=member_id, anho="2019", mes="09")
    assert invoice.derecho == 300
    invoice.caudal_actual = 0
    invoice.save()

    response = api_client.post("/api/invoicingmonths/", {"anho": 2019, "mes": 10})
    response_data = response.json()
    assert response.status_code == 201, response_data
    invoice = Invoice.objects.get(
        member=member_id, mes_facturacion=response_data["id_mes_facturacion"],
    )
    assert invoice.derecho == 0
