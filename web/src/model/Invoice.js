import {NumberUtil} from "utilities";

const SECTORES_COMUNIDADES = {
    "0": "",
    "1": "TIHUAPA NORTE",
    "2": "TIHUAPA NORTE",
    "3": "TIHUAPA NORTE",
    "4": "TIHUAPA NORTE",
    "5": "TLACUXTLI",
    "6": "TLACUXTLI",
    "7": "TLACUXTLI",
};

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

const getTipoSocio = function(solo_mecha, consumo_maximo, consumo_reduccion_fija) {
    if (solo_mecha === true) {
        return "solo_mecha";
    }
    if (consumo_maximo !== 0 || consumo_reduccion_fija !== 0) {
        return "con_ajuste_consumo";
    }
    return "normal";
};

const invoice_api_adapter = invoice => {
    invoice["numero"] =
        invoice.member.num_socio.toString().padStart(4, "0") +
        invoice.anho.toString() +
        invoice.mes_facturado.toString().padStart(2, "0") +
        invoice.version.toString().padStart(2, "0");
    invoice["num_socio"] = invoice.member.num_socio;
    invoice["tipo_socio"] = getTipoSocio(
        invoice.member.solo_mecha,
        invoice.member.consumo_maximo,
        invoice.member.consumo_reduccion_fija
    );
    invoice["total_pagado"] = invoice.pago_1_al_11 + invoice.pago_11_al_30;
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
    id_factura = -1,
    version = -1,
    mes_facturacion = "",
    numero = "",
    ahorro = 0,
    anho = 0,
    asamblea = 0,
    caudal_actual = 0,
    caudal_anterior = 0,
    comision = 0,
    comprobar_pago_11_al_30 = 0,
    comprobar_pago_1_al_11 = 0,
    consumo = null,
    cuota_fija = 0,
    cuota_variable = 0,
    derecho = 0,
    entrega = "",
    mes_facturado = 0,
    mes_limite = 0,
    anho_limite = 0,
    mora = 0,
    nombre = "",
    num_socio = -1,
    tipo_socio = "",
    observaciones = "",
    pago_11_al_30 = 0,
    pago_1_al_11 = 0,
    reconexion = 0,
    saldo_pendiente = 0,
    sector = "",
    total_pagado = 0,
    descuento = 0,
    total = 0,
    traspaso = 0,
    estado = "",
    resumen = [],
    is_active = true,
} = {}) => {
    const publicApi = {
        id_factura,
        version,
        mes_facturacion,
        numero,
        ahorro: NumberUtil.parseFloatOrNull(ahorro),
        anho,
        asamblea: NumberUtil.parseFloatOrNull(asamblea),
        caudal_actual: NumberUtil.parseIntOrNull(caudal_actual),
        caudal_anterior: NumberUtil.parseIntOrNull(caudal_anterior),
        comision: NumberUtil.parseFloatOrNull(comision),
        comprobar_pago_11_al_30,
        comprobar_pago_1_al_11,
        consumo: NumberUtil.parseIntOrNull(consumo),
        cuota_fija: NumberUtil.parseFloatOrNull(cuota_fija),
        cuota_variable: NumberUtil.parseFloatOrNull(cuota_variable),
        derecho: NumberUtil.parseFloatOrNull(derecho),
        entrega,
        mes_facturado,
        mes_limite,
        anho_limite,
        mora: NumberUtil.parseFloatOrNull(mora),
        nombre,
        num_socio,
        tipo_socio,
        observaciones,
        pago_11_al_30: NumberUtil.parseFloatOrNull(pago_11_al_30),
        pago_1_al_11: NumberUtil.parseFloatOrNull(pago_1_al_11),
        reconexion: NumberUtil.parseFloatOrNull(reconexion),
        saldo_pendiente: NumberUtil.parseFloatOrNull(saldo_pendiente),
        sector,
        total_pagado: NumberUtil.parseFloatOrNull(total_pagado),
        descuento: NumberUtil.parseFloatOrNull(descuento),
        total: NumberUtil.parseFloatOrNull(total),
        traspaso: NumberUtil.parseFloatOrNull(traspaso),
        estado,
        resumen,
        is_active,
    };

    Object.defineProperty(publicApi, "comunidad", {
        value: SECTORES_COMUNIDADES[sector],
        enumerable: true, // valor por defecto pero interesa ser explicito
    });

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

const refreshInvoiceValues = (invoice, consumo_maximo, consumo_reduccion_fija) => {
    const consumo = invoice.caudal_actual - invoice.caudal_anterior;
    const consumo_final =
        (consumo_maximo !== 0 ? Math.min(consumo, consumo_maximo) : consumo) -
        consumo_reduccion_fija;
    let cuota_variable = null;
    if (consumo_final <= 14) {
        cuota_variable = COSTE_METRO_CUBICO.CUOTA_VARIABLE_MENOS_14 * consumo_final;
    } else if (consumo_final > 14 && consumo_final <= 20) {
        cuota_variable = COSTE_METRO_CUBICO.CUOTA_VARIABLE_14_20 * consumo_final;
    } else if (consumo_final > 20) {
        cuota_variable = COSTE_METRO_CUBICO.CUOTA_VARIABLE_MAS_20 * consumo_final;
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
        invoice.saldo_pendiente -
        invoice.descuento;
    return createInvoice(Object.assign({}, invoice, {consumo, cuota_variable, total}));
};

export {
    createInvoice as default,
    invoice_api_adapter,
    createInvoices,
    invoices_api_adapter,
    ESTADOS_FACTURA,
    refreshInvoiceValues,
};
