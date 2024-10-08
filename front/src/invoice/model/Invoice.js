import {DateUtil, NumberUtil} from "base/format/utilities";
import {getTipoSocio} from "../../member/model/Member";

const ESTADOS_FACTURA = {
    NUEVA: "nueva",
    PENDIENTE_DE_COBRO: "pendiente_de_cobro",
    COBRADA: "cobrada",
    NO_COBRADA: "no_cobrada",
    ANULADA: "anulada",
};

class Invoices extends Array {
    getInvoice(num_factura) {
        const invoices = this.filter(invoice => {
            return invoice["numero"] === num_factura;
        });
        if (invoices.length === 1) {
            return invoices[0];
        }
        throw new Error("No hay recibos con ese identificador");
    }
}

const getNumero = (member_id, anho, mes, version) => {
    return (
        member_id.toString().padStart(4, "0") +
        anho.toString() +
        mes.toString().padStart(2, "0") +
        version.toString().padStart(2, "0")
    );
};

const invoice_api_adapter = invoice => {
    invoice["numero"] = getNumero(
        invoice.member_data.id,
        invoice.anho,
        invoice.mes,
        invoice.version
    );
    invoice["member_id"] = invoice.member_data.id;
    invoice["nombre"] = invoice.member_data.name;
    invoice["status"] = getTipoSocio(invoice.member_data);
    invoice["sector"] = invoice.member_data.sector;
    invoice["total_pagado"] = invoice.ontime_payment + invoice.late_payment;
    invoice["is_active"] = invoice.estado !== ESTADOS_FACTURA.ANULADA;
    return invoice;
};

const invoice_view_adapter = invoice => {
    delete invoice["numero"];
    delete invoice["member_id"];
    delete invoice["nombre"];
    delete invoice["status"];
    delete invoice["sector"];
    delete invoice["total_pagado"];
    delete invoice["is_active"];
    delete invoice["member_data"];
    delete invoice["errors"];
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
    id = -1,
    version = null,
    anho = null,
    mes = null,
    mes_facturacion = "",
    due_date = null,
    member = null,
    member_data = null,
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
    comprobar_late_payment = null,
    comprobar_ontime_payment = null,
    asamblea = null,
    jornada_trabajo = null,
    cuota_variable = null,
    late_payment = null,
    ontime_payment = null,
    total_pagado = null,
    descuento = null,
    traspaso = null,
    otros = null,
    observaciones = "",
    resumen = [],
    nombre = "",
    member_id = -1,
    status = "",
    sector = "",
    has_payments = false,
    has_measurements = false,
    errors = [],
} = {}) => {
    const publicApi = {
        id,
        version,
        anho,
        mes,
        mes_facturacion,
        due_date: DateUtil.fromValidISO(due_date),
        member,
        member_data,
        caudal_actual: caudal_actual === null ? null : parseInt(caudal_actual),
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
        jornada_trabajo: NumberUtil.parseFloatOrNull(jornada_trabajo),
        comprobar_late_payment,
        comprobar_ontime_payment,
        cuota_variable: NumberUtil.parseFloatOrNull(cuota_variable),
        numero,
        estado,
        is_active,
        late_payment: NumberUtil.parseFloatOrNull(late_payment),
        ontime_payment: NumberUtil.parseFloatOrNull(ontime_payment),
        total_pagado: NumberUtil.parseFloatOrNull(total_pagado),
        descuento: NumberUtil.parseFloatOrNull(descuento),
        traspaso: NumberUtil.parseFloatOrNull(traspaso),
        otros: NumberUtil.parseFloatOrNull(otros),
        observaciones,
        resumen,
        nombre,
        member_id,
        status,
        sector,
        has_payments,
        has_measurements,
        errors,

        get consumo() {
            if (this.caudal_actual === null) {
                return null;
            }
            return this.caudal_actual - this.caudal_anterior;
        },

        get isNewInvoice() {
            return this.id === -1;
        },

        get hasMeasurement() {
            return this.caudal_actual !== null;
        },

        get member_name() {
            return this.member_data?.name;
        },

        /*
            day is an integer that represents the day of a month 1 - 31 and returns
            the readingDay in a string localized format
        */
        readingDay(day) {
            return DateUtil.toLocal(
                DateUtil.substractMonth(
                    DateUtil.fromYearMonthDay(this.anho, this.mes, day),
                    1
                )
            );
        },
    };

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

const createInvoiceForMember = (member, invoicingMonth, version) => {
    return createInvoice({
        numero: getNumero(member.id, invoicingMonth.anho, invoicingMonth.mes, version),
        mes_facturacion: invoicingMonth.id_mes_facturacion,
        anho: invoicingMonth.anho,
        mes: invoicingMonth.mes,
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
    ESTADOS_FACTURA,
};
