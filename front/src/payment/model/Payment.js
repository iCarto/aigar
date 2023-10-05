import {DateUtil} from "base/format/utilities";

class Payments extends Array {}

const payment_view_adapter = payment => {
    return {
        id_factura: payment["id_factura"],
        fecha: DateUtil.parse(payment["fecha"]),
        monto: parseFloat(payment["monto"]),
    };
};

const payment_api_adapter = payment => {
    payment["fecha"] = DateUtil.format(payment["fecha"]);
    payment["id_factura"] = payment["factura"];

    return payment;
};

const payments_view_adapter = payments => payments.map(payment_view_adapter);

const payments_api_adapter = payments => payments.map(payment_api_adapter);

const createPayments = (data = []) => {
    const members = Payments.from(data, payment => createPayment(payment));
    return members;
};

const createPayment = ({
    id = null,
    fecha = null,
    monto = null,
    member_id = null,
    member_name = "",
    sector = "",
    num_factura = "",
    id_factura = null,
    errors = [],
} = {}) => {
    const publicApi = {
        // id_pago es el id que llega del back y se guarda en BD. Las propiedades fecha y monto también están en BD; el resto de campos solo se usan en el front.
        id,
        fecha,
        monto,
        member_id:
            member_id !== -1 ? parseInt(member_id) : parseInt(num_factura.substr(0, 4)),
        member_name,
        sector,
        num_factura: num_factura !== "" ? num_factura.padStart(12, "0") : num_factura,
        id_factura,
        errors,
    };

    return Object.freeze(publicApi);
};

export {
    createPayment as default,
    createPayments,
    payment_view_adapter,
    payments_view_adapter,
    payment_api_adapter,
    payments_api_adapter,
};
