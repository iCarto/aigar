fixed_values = {
    "COMISION": 0.28,
    "AHORRO_MANO_DE_OBRA_NORMAL": 0.25,
    "AHORRO_MANO_DE_OBRA_SOLO_MECHA": 0,
    "CUOTA_FIJA_NORMAL": 5.72,
    "CUOTA_FIJA_SOLO_MECHA": 2.72,
    "CUOTA_VARIABLE_MENOS_14": 0,
    "CUOTA_VARIABLE_14_20": 0.75,
    "CUOTA_VARIABLE_MAS_20": 2.5,
    "DERECHO_CONEXION": 400,
}


def get_derecho_value(last_month_invoice):
    if last_month_invoice is None:
        return fixed_values["DERECHO_CONEXION"]
    return 0


def get_reconexion_value(member, last_month_invoice):
    # TODO Comprobar que la factura anterior fue emitida para un socio con solo mecha
    # pero ahora el socio está activo. Nos basamos en el campo de cuota_fija o creamos un nuevo campo?
    if (
        not member.solo_mecha
        and last_month_invoice
        and last_month_invoice.cuota_fija == fixed_values["CUOTA_FIJA_SOLO_MECHA"]
    ):
        return 10
    return 0


def get_mora_value(last_month_invoice):
    if last_month_invoice and last_month_invoice.pago_1_al_10 == 0:
        return 1
    return 0


def get_saldo_pendiente_value(last_month_invoice):
    if last_month_invoice:
        return (
            (last_month_invoice.total or 0)
            - last_month_invoice.pago_1_al_10
            - last_month_invoice.pago_11_al_30
        )
    return 0
