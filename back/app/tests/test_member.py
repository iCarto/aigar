import pytest
from django.core import exceptions

from app.models.forthcoming_invoice_item import (
    ForthcomingInvoiceItem,
    ForthcomingInvoiceItemName,
)
from app.models.member import Member, UseTypes
from app.tests.factories import MemberFactory
from domains.models.member_status import MemberStatus
from domains.tests.factories import ZoneFactory


pytestmark = pytest.mark.django_db


@pytest.mark.skip("Not working")
def test_negative_order_not_allowed():
    data = {
        "name": "foo",
        "medidor": "123456",
        "orden": -1,
        "status": MemberStatus.ACTIVE,
        "tipo_uso": "Humano",
        "sector": ZoneFactory.create(),
    }
    member = Member(**data)
    member.full_clean()
    member.save()
    assert member.orden == -1


def test_none_order_only_allowed_for_deleted():
    member = MemberFactory.create(orden=1, status=MemberStatus.ACTIVE)
    member.orden = None
    with pytest.raises(
        exceptions.ValidationError,
        match="El campo orden sólo puede ser nulo para socias eliminadas",
    ):
        member.save()
    member.status = MemberStatus.DELETED
    member.save()
    assert member.status == MemberStatus.DELETED
    assert member.orden is None


def test_derecho_conexion_humano():
    member = MemberFactory.create(tipo_uso=UseTypes.HUMANO)
    items = (
        ForthcomingInvoiceItem.objects.filter(
            item=ForthcomingInvoiceItemName.derecho, member=member
        )
        .order_by("id")
        .values_list("value", flat=True)
    )
    assert len(items) == 5
    assert list(items) == [100, 50, 50, 50, 50]


def test_derecho_conexion_comercial():
    member = MemberFactory.create(tipo_uso=UseTypes.COMERCIAL)
    items = (
        ForthcomingInvoiceItem.objects.filter(
            item=ForthcomingInvoiceItemName.derecho, member=member
        )
        .order_by("id")
        .values_list("value", flat=True)
    )
    assert len(items) == 3
    assert list(items) == [150, 125, 125]
