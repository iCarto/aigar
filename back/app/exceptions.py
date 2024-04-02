from rest_framework.exceptions import APIException


class ClosedMonthException(APIException):
    status_code = 403
    default_detail = "Operación no permitida sobre un mes de facturación cerrado."
    default_code = "closed_month_exception"


class ImportConfigError(ValueError):
    pass


class BadInvoicingMonthImportError(ImportConfigError):
    def __init__(self, expected, actual):
        self.expected = expected
        self.actual = actual

        super().__init__(
            "El mes de facturacion no coincide. "
            f"Esperado: {self.expected}. Importado:{self.actual}"
        )


class LessVolumeImportError(ImportConfigError):
    def __init__(self, actual, anterior, invoice):
        self.actual = actual
        self.anterior = anterior
        self.invoice = invoice

        super().__init__(
            f"El caudal actual ({self.actual}) no puede ser inferior al caudal anterior ({self.anterior}). "
            "Si es por un cambio de medidor ponga un valor superior ahora  y modifiquelo más tarde: "
            f"/gestion/app/invoice/{invoice.id}/change/"
        )


class NotNullOrLessThan0ImportError(ImportConfigError):
    def __init__(self, value):
        self.value = value

        super().__init__(
            f"El campo no puede estar vacio ni valer menos de 0: {self.value}"
        )
