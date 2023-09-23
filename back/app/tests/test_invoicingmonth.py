import pytest
from django.core import exceptions

from app.tests.factories import InvoicingMonthFactory


pytestmark = pytest.mark.django_db


def test_error_if_more_than_one_open():
    invoicingmonth1 = InvoicingMonthFactory.build(anho=2019, mes=9, is_open=True)
    invoicingmonth1.save()

    invoicingmonth2 = InvoicingMonthFactory.build(anho=2019, mes=10, is_open=True)
    with pytest.raises(
        exceptions.ValidationError,
        match="Existen varios meses de facturación abiertos. Debe revisar este problema.",
    ):
        invoicingmonth2.save()
