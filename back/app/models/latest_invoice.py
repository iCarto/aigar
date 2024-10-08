from decimal import Decimal

from app.models.invoice import Invoice
from domains.models import aigar_config


class LatestInvoice(Invoice):
    class Meta:
        proxy = True

    def calculated_mora(self) -> Decimal:
        if self.ontime_payment >= self.total_or0:
            return Decimal(0)
        return aigar_config.get_config().recargo_mora


class NoLatestInvoice:
    @property
    def deuda(self) -> float:
        return 0

    @property
    def caudal_actual(self) -> float:
        return 0

    def calculated_derecho(self) -> float:
        return 0

    def calculated_mora(self) -> float:
        return 0
