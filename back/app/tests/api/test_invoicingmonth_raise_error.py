import pytest
from django.core import exceptions

from app.tests.factories import InvoicingMonthFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("no implemented jet")
def test_calculate_derecho_conexion():
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
