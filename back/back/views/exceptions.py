from rest_framework.exceptions import APIException


class ClosedMonthException(APIException):
    status_code = 403
    default_detail = "Operación no permitida sobre un mes de facturación cerrado."
    default_code = "closed_month_exception"
