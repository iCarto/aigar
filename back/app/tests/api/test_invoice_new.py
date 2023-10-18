import pytest
from django.core import exceptions
from django.db import utils
from rest_framework import status

from app.models.invoice import Invoice, InvoiceStatus
from app.models.member import UseTypes
from app.tests.factories import InvoiceFactory, MemberFactory
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
    """Una socia no puede tener dos facturas para el mismo mes."""
    invoice = InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        member__status=MemberStatus.ACTIVE,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
    )
    # Una socia no puede tener más de dos facturas
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


def test_connection_is_included_in_new_invoices(api_client, create_invoicing_month):
    """Para una nueva socia, una factura a mano incluye el derecho de conexión."""
    InvoiceFactory.create(
        estado=InvoiceStatus.NUEVA,
        mes_facturacion=create_invoicing_month(anho="2019", mes="09", is_open=True),
    )
    member = MemberFactory.create(tipo_uso=UseTypes.HUMANO, status=MemberStatus.ACTIVE)
    response = api_client.post(
        "/api/invoices/",
        {
            "anho": "2019",
            "mes": "09",
            "caudal_anterior": 0,
            "cauda_actual": 0,
            "member": member.pk,
            "version": 1,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.json()

    invoice = Invoice.objects.get(anho="2019", mes="09", member=member.pk)
    assert invoice.mora == 0
    assert invoice.saldo_pendiente == 0
    assert invoice.derecho == 100


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
