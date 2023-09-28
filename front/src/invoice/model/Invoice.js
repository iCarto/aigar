import {NumberUtil} from "base/format/utilities";
import {getTipoSocio} from "../../member/model/Member";

const ESTADOS_FACTURA = {
    NUEVA: "nueva",
    PENDIENTE_DE_COBRO: "pendiente_de_cobro",
    COBRADA: "cobrada",
    ANULADA: "anulada",
};

const COSTE_METRO_CUBICO = {
    CUOTA_VARIABLE_MENOS_14: 0,
    CUOTA_VARIABLE_14_20: 0.75,
    CUOTA_VARIABLE_MAS_20: 2.5,
};

class Invoices extends Array {
    getInvoice(num_factura) {
        const invoices = this.filter(invoice => {
            return invoice["numero"] === num_factura;
        });
        if (invoices.length === 1) {
            return invoices[0];
        }
        throw new Error("No hay facturas con ese identificador");
    }
}

const getNumero = (num_socio, anho, mes_facturado, version) => {
    return (
        num_socio.toString().padStart(4, "0") +
        anho.toString() +
        mes_facturado.toString().padStart(2, "0") +
        version.toString().padStart(2, "0")
    );
};

const invoice_api_adapter = invoice => {
    invoice["numero"] = getNumero(
        invoice.member_data.num_socio,
        invoice.anho,
        invoice.mes_facturado,
        invoice.version
    );
    invoice["num_socio"] = invoice.member_data.num_socio;
    invoice["nombre"] = invoice.member_data.name;
    invoice["status"] = getTipoSocio(invoice.member_data);
    invoice["sector"] = invoice.member_data.sector;
    invoice["total_pagado"] = invoice.pago_1_al_10 + invoice.pago_11_al_30;
    invoice["is_active"] = invoice.estado !== ESTADOS_FACTURA.ANULADA;
    return invoice;
};

const invoice_view_adapter = invoice => {
    delete invoice["numero"];
    delete invoice["num_socio"];
    delete invoice["nombre"];
    delete invoice["status"];
    delete invoice["sector"];
    delete invoice["total_pagado"];
    delete invoice["is_active"];
    return invoice;
};

const invoices_api_adapter = invoices => {
    return invoices.map(invoice => {
        invoice = invoice_api_adapter(invoice);
        return invoice;
    });
};

const createInvoices = (data = []) => {
    const invoices = Invoices.from(data, invoice => {
        return createInvoice(invoice);
    });
    return invoices;
};

const createInvoice = ({
    id_factura = null,
    version = null,
    anho = null,
    mes_facturado = 0,
    mes_facturacion = "",
    mes_limite = 0,
    anho_limite = 0,
    member = null,
    caudal_actual = null,
    caudal_anterior = null,
    cuota_fija = null,
    comision = null,
    ahorro = null,
    derecho = null,
    reconexion = null,
    mora = null,
    saldo_pendiente = null,
    total = null,
    numero = "",
    estado = "",
    is_active = true,
    comprobar_pago_11_al_30 = null,
    comprobar_pago_1_al_10 = null,
    asamblea = null,
    cuota_variable = null,
    entrega = false,
    pago_11_al_30 = null,
    pago_1_al_10 = null,
    total_pagado = null,
    descuento = null,
    traspaso = null,
    otros = null,
    observaciones = "",
    resumen = [],
    nombre = "",
    num_socio = -1,
    status = "",
    sector = "",
    errors = [],
} = {}) => {
    const publicApi = {
        id_factura,
        version,
        anho,
        mes_facturado,
        mes_facturacion,
        mes_limite,
        anho_limite,
        member,
        caudal_actual: NumberUtil.parseIntOrNull(caudal_actual),
        caudal_anterior: NumberUtil.parseIntOrNull(caudal_anterior),
        cuota_fija: NumberUtil.parseFloatOrNull(cuota_fija),
        comision: NumberUtil.parseFloatOrNull(comision),
        ahorro: NumberUtil.parseFloatOrNull(ahorro),
        derecho: NumberUtil.parseFloatOrNull(derecho),
        reconexion: NumberUtil.parseFloatOrNull(reconexion),
        mora: NumberUtil.parseFloatOrNull(mora),
        saldo_pendiente: NumberUtil.parseFloatOrNull(saldo_pendiente),
        total: NumberUtil.parseFloatOrNull(total),
        asamblea: NumberUtil.parseFloatOrNull(asamblea),
        comprobar_pago_11_al_30,
        comprobar_pago_1_al_10,
        cuota_variable: NumberUtil.parseFloatOrNull(cuota_variable),
        entrega,
        numero,
        estado,
        is_active,
        pago_11_al_30: NumberUtil.parseFloatOrNull(pago_11_al_30),
        pago_1_al_10: NumberUtil.parseFloatOrNull(pago_1_al_10),
        total_pagado: NumberUtil.parseFloatOrNull(total_pagado),
        descuento: NumberUtil.parseFloatOrNull(descuento),
        traspaso: NumberUtil.parseFloatOrNull(traspaso),
        otros: NumberUtil.parseFloatOrNull(otros),
        observaciones,
        resumen,
        nombre,
        num_socio,
        status,
        sector,
        errors,

        get consumo() {
            let _consumo = this.caudal_actual - this.caudal_anterior;
            if (isNaN(_consumo)) {
                return null;
            }
            return _consumo;
        },
    };

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

const refreshInvoiceValues = (invoice, consumo_maximo, consumo_reduccion_fija) => {
    const consumo_final =
        (consumo_maximo != null
            ? Math.min(invoice.consumo, consumo_maximo)
            : invoice.consumo) - (consumo_reduccion_fija || 0);
    let cuota_variable = null;
    if (consumo_final <= 14) {
        cuota_variable = COSTE_METRO_CUBICO.CUOTA_VARIABLE_MENOS_14 * consumo_final;
    } else if (consumo_final > 14 && consumo_final < 20) {
        cuota_variable =
            COSTE_METRO_CUBICO.CUOTA_VARIABLE_MENOS_14 * 14 +
            COSTE_METRO_CUBICO.CUOTA_VARIABLE_14_20 * (consumo_final - 14);
    } else if (consumo_final >= 20) {
        cuota_variable =
            COSTE_METRO_CUBICO.CUOTA_VARIABLE_MENOS_14 * 14 +
            COSTE_METRO_CUBICO.CUOTA_VARIABLE_14_20 * 6 +
            COSTE_METRO_CUBICO.CUOTA_VARIABLE_MAS_20 * (consumo_final - 20);
    }
    let total =
        invoice.cuota_fija +
        cuota_variable +
        invoice.comision +
        invoice.ahorro +
        invoice.mora +
        invoice.asamblea +
        invoice.derecho +
        invoice.reconexion +
        invoice.traspaso +
        invoice.otros +
        invoice.saldo_pendiente -
        invoice.descuento;
    if (isNaN(total)) {
        total = null;
    } else {
        total = total.toFixed(2);
    }
    return createInvoice(Object.assign({}, invoice, {cuota_variable, total}));
};

const createInvoiceForMember = (member, invoicingMonth, version) => {
    const invoicingMonthAnho = parseInt(invoicingMonth.anho);
    const invoicingMonthMes = parseInt(invoicingMonth.mes);
    return createInvoice({
        numero: getNumero(
            member.num_socio,
            invoicingMonth.anho,
            invoicingMonth.mes,
            version
        ),
        mes_facturacion: invoicingMonth.id_mes_facturacion,
        anho: invoicingMonthAnho,
        mes_facturado: invoicingMonthMes,
        anho_limite:
            invoicingMonthMes === 12 ? invoicingMonthAnho + 1 : invoicingMonthAnho,
        mes_limite: (invoicingMonthMes + 1) % 12,
        estado: ESTADOS_FACTURA.NUEVA,
        version,
    });
};

export {
    createInvoice as default,
    createInvoices,
    createInvoiceForMember,
    invoice_api_adapter,
    invoices_api_adapter,
    invoice_view_adapter,
    refreshInvoiceValues,
    ESTADOS_FACTURA,
};
