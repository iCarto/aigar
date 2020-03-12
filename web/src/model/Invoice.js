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

const invoice_api_adapter = m => {
    m["ahorro"] = Number(m["ahorro"]) || 0;
    m["asamblea"] = Number(m["asamblea"]) || 0;
    m["caudal_actual"] = Number(m["caudal_actual"]) || 0;
    m["caudal_anterior"] = Number(m["caudal_anterior"]) || 0;
    m["comision"] = Number(m["comision"]) || 0;
    m["comprobar_pago_11_al_30"] = Number(m["comprobar_pago_11_al_30"]) || 0;
    m["comprobar_pago_1_al_11"] = Number(m["comprobar_pago_1_al_11"]) || 0;
    m["consumo"] = Number(m["consumo"]) || 0;
    m["cuota_fija"] = Number(m["cuota_fija"]) || 0;
    m["cuota_variable"] = Number(m["cuota_variable"]) || 0;
    m["derecho"] = Number(m["derecho"]) || 0;
    m["entrega"] = m["entrega"] === "Si" ? true : false;
    m["mes_facturado"] = Number(m["mes_facturado"]);
    m["mes_limite"] = Number(m["mes_limite"]);
    m["mora"] = Number(m["mora"]) || 0;
    m["pago_11_al_30"] = Number(m["pago_11_al_30"]) || 0;
    m["pago_1_al_11"] = Number(m["pago_1_al_11"]) || 0;
    m["reconexion"] = Number(m["reconexion"]) || 0;
    m["saldo_anterior"] = Number(m["saldo_anterior"]) || 0;
    m["saldo_pendiente"] = Number(m["saldo_pendiente"]) || 0;
    m["total"] = Number(m["total"]) || 0;
    m["traspaso"] = Number(m["traspaso"]) || 0;
    return m;
};

const invoices_api_adapter = invoices => {
    /*let result = [];
    Object.keys(invoices).forEach(year => {
        Object.keys(invoices[year]).forEach(month => {
            let monthInvoices = invoices[year][month].map(invoice => {
                invoice = invoice_api_adapter(invoice);
                invoice.numero =
                    invoice.numero_socio.toString() +
                    invoice.anho.toString() +
                    invoice.mes_facturado.toString() +
                    "01";
                return invoice;
            });
            result.push(...monthInvoices);
        });
    });
    return result;*/
    return invoices.map(invoice => {
        invoice = invoice_api_adapter(invoice);
        invoice.numero =
            invoice.num_socio.toString() +
            invoice.anho.toString() +
            invoice.mes_facturado.toString() +
            "01";
        return invoice;
    });
};

const createInvoices = (data = []) => {
    const invoices = Invoices.from(data, m => {
        return createInvoice(m);
    });
    return invoices;
};

const createInvoice = ({
    numero = "",
    ahorro = 0,
    anho = 0,
    asamblea = 0,
    caudal_actual = 0,
    caudal_anterior = 0,
    comision = 0,
    comprobar_pago_11_al_30 = 0,
    comprobar_pago_1_al_11 = 0,
    consumo = 0,
    cuota_fija = 0,
    cuota_variable = 0,
    derecho = 0,
    entrega = "",
    mes_facturado = 0,
    mes_limite = 0,
    mora = 0,
    nombre = "",
    numero_socio = "",
    observaciones = "",
    pago_11_al_30 = 0,
    pago_1_al_11 = 0,
    reconexion = 0,
    saldo_anterior = 0,
    saldo_pendiente = 0,
    sector = "",
    total = 0,
    traspaso = 0,
} = {}) => {
    const publicApi = {
        numero,
        ahorro,
        anho,
        asamblea,
        caudal_actual: parseFloat(caudal_anterior) + parseFloat(consumo),
        caudal_anterior,
        comision,
        comprobar_pago_11_al_30,
        comprobar_pago_1_al_11,
        consumo,
        cuota_fija,
        cuota_variable,
        derecho,
        entrega,
        mes_facturado,
        mes_limite,
        mora,
        nombre,
        numero_socio,
        observaciones,
        pago_11_al_30,
        pago_1_al_11,
        reconexion,
        saldo_anterior,
        saldo_pendiente,
        sector,
        total,
        traspaso,
    };

    Object.defineProperty(publicApi, "comunidad", {
        value: SECTORES_COMUNIDADES[sector],
        enumerable: true, // valor por defecto pero interesa ser explicito
    });

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

export {
    createInvoice as default,
    invoice_api_adapter,
    createInvoices,
    invoices_api_adapter,
};
