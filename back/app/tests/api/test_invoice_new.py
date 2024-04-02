from unittest.mock import patch

import pytest
from django.core import exceptions
from django.db import utils
from rest_framework import status

from app.models.forthcoming_invoice_item import (
    ForthcomingInvoiceItem,
    ForthcomingInvoiceItemName,
)
from app.models.invoice import Invoice
from app.models.invoice_status import InvoiceStatus
from app.models.member import UseTypes
from app.tests.factories import InvoiceFactory, InvoicingMonthFactory, MemberFactory
from domains.models.member_status import MemberStatus


pytestmark = pytest.mark.django_db


def test_invoice_can_be_created(api_client, create_invoicing_month):
    """Una nueva factura puede ser creada a mano (nuevas socias y reconectadas)."""
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        member__status=MemberStatus.ACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
    )
    member = MemberFactory.create()
    response = api_client.post(
        "/api/invoices/",
        {
            "anho": "2019",
            "mes": "09",
            "caudal_anterior": 0,
            "member": member.id,
            "version": 1,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.json()
    member.refresh_from_db()
    invoice = member.invoice_set.first()
    assert invoice is not None


def test_not_two_invoices_for_a_member(api_client, create_invoicing_month):
    """Una socia no puede tener dos recibos para el mismo mes."""
    invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        member__status=MemberStatus.ACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
    )
    # Una socia no puede tener más de dos recibos
    with pytest.raises(
        utils.IntegrityError,
        match="UNIQUE constraint failed: app_invoice.mes_facturacion_id, app_invoice.member_id",
    ):
        api_client.post(
            "/api/invoices/",
            {
                "anho": "2019",
                "mes": "09",
                "caudal_anterior": 0,
                "member": invoice.member_id,
                "version": 1,
            },
        )


def test_dont_create_invoices_for_closed_months(api_client, create_invoicing_month):
    """No se pueden crear facturas a mano para meses cerrados."""
    create_invoicing_month(anho="2019", mes="09", is_open=False)
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="10", is_open=True),
        estado=InvoiceStatus.NUEVA,
        member__status=MemberStatus.ACTIVE,
    )

    with pytest.raises(
        exceptions.ValidationError, match="El mes no está abierto o no existe."
    ):
        api_client.post(
            "/api/invoices/",
            {
                "anho": "2019",
                "mes": "09",
                "caudal_anterior": 0,
                "member": MemberFactory.create().id,
                "version": 1,
            },
        )


def test_dont_create_for_not_existent_months(api_client, create_invoicing_month):
    """No se pueden crear facturas a mano para meses que no existen."""
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
        estado=InvoiceStatus.NUEVA,
        member__status=MemberStatus.ACTIVE,
    )
    with pytest.raises(
        exceptions.ValidationError, match="El mes no está abierto o no existe."
    ):
        api_client.post(
            "/api/invoices/",
            {
                "anho": "2019",
                "mes": "08",
                "caudal_anterior": 0,
                "member": MemberFactory.create().id,
                "version": 1,
            },
        )


def test_debt_is_included_in_new_invoices(api_client, create_invoicing_month):
    """Cuando se crea una factura a mano la deuda es incluída."""
    old_invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NO_COBRADA,
        total=100,
        late_payment=50,
        member__status=MemberStatus.ACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=False),
    )
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        mes_facturacion=create_invoicing_month(anho="2019", mes="10", is_open=True),
    )
    member_pk = old_invoice.member.pk
    response = api_client.post(
        "/api/invoices/",
        {
            "anho": "2019",
            "mes": "10",
            "caudal_anterior": 0,
            "cauda_actual": 0,
            "member": member_pk,
            "version": 1,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.json()
    invoice = Invoice.objects.get(anho="2019", mes="10", member=member_pk)
    assert invoice.mora == 1
    assert invoice.saldo_pendiente == 50


def test_reconnection_is_included_in_new_invoices(api_client, create_invoicing_month):
    """Para una socia reconectada, una factura a mano incluye la reconexión."""
    old_invoice = InvoiceFactory.create(
        estado=InvoiceStatus.COBRADA,
        total=100,
        ontime_payment=100,
        member__status=MemberStatus.INACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=False),
    )
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        mes_facturacion=create_invoicing_month(anho="2019", mes="10", is_open=True),
    )
    member_pk = old_invoice.member.pk
    api_client.put(
        "/api/members/status/", {"pks": [member_pk], "status": MemberStatus.ACTIVE}
    )
    response = api_client.post(
        "/api/invoices/",
        {
            "anho": "2019",
            "mes": "10",
            "caudal_anterior": 0,
            "cauda_actual": 0,
            "member": member_pk,
            "version": 1,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.json()
    invoice = Invoice.objects.get(anho="2019", mes="10", member=member_pk)
    assert invoice.reconexion == 10
    assert invoice.mora == 0
    assert invoice.saldo_pendiente == 0


def test_new_invoice_for_derecho_conexion_is_created(create_invoicing_month):
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True)
    )
    member = MemberFactory.create(tipo_uso=UseTypes.HUMANO, selected_fee_value=100)
    invoice = Invoice.objects.get(member=member)
    assert invoice.derecho == 100
    assert invoice.total == 100


def test_derecho_conexion_humano(create_invoicing_month):
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True)
    )
    member = MemberFactory.create(tipo_uso=UseTypes.HUMANO, selected_fee_value=50)
    invoice = Invoice.objects.get(member=member)
    assert invoice.derecho == 100
    assert invoice.total == 100
    items = (
        ForthcomingInvoiceItem.objects.filter(
            item=ForthcomingInvoiceItemName.derecho, member=member
        )
        .order_by("id")
        .values_list("value", flat=True)
    )
    assert len(items) == 4
    assert list(items) == [50, 50, 50, 50]


def test_derecho_conexion_comercial(create_invoicing_month):
    InvoiceFactory.create(
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True)
    )
    member = MemberFactory.create(tipo_uso=UseTypes.COMERCIAL, selected_fee_value=50)
    invoice = Invoice.objects.get(member=member)
    assert invoice.derecho == 150
    assert invoice.total == 150
    items = (
        ForthcomingInvoiceItem.objects.filter(
            item=ForthcomingInvoiceItemName.derecho, member=member
        )
        .order_by("id")
        .values_list("value", flat=True)
    )
    assert len(items) == 5
    assert list(items) == [50, 50, 50, 50, 50]


@patch("app.models.invoicing_month.any_payments_for", return_value=True)
def test_caudal_actual_is_none_when_creating_month(_, api_client):
    # Varias comprobaciones de en que estado está la app, se basan en si el caudal_actual
    # es None. Este test nos protege de confundir 0 con None. La otra opción es que
    # comprobemos directamente si existe una lectura asociada al recibo en lugar de
    # fijarnos en el valor del caudal.
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

    api_client.post("/api/invoicingmonths/", {"anho": "2019", "mes": "10"})

    invoice = Invoice.objects.get(anho="2019", mes="10", estado=InvoiceStatus.NUEVA)
    assert invoice.caudal_anterior == 10
    assert invoice.caudal_actual is None
