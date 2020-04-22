import {DateUtil} from "utilities";

class Payments extends Array {}

const payment_api_adapter = payment => {
    return {
        id_factura: payment["id_factura"],
        fecha: DateUtil.parse(payment["fecha"]),
        monto: payment["monto"],
    };
};

const payment_front_adapter = payment => {
    payment["fecha"] = DateUtil.format(payment["fecha"]);
    return payment;
};

const payments_api_adapter = payments => payments.map(payment_api_adapter);

const payments_front_adapter = payments => payments.map(payment_front_adapter);

const createPayments = (data = []) => {
    const members = Payments.from(data, payment => createPayment(payment));
    return members;
};

const createPayment = ({
    id = -1,
    sector = -1,
    num_socio = -1,
    nombre_socio = "",
    num_factura = "",
    id_factura = -1,
    fecha = -1,
    monto = -1,
    errors = [],
} = {}) => {
    const publicApi = {
        id: num_factura + fecha,
        num_socio:
            num_socio !== -1 ? parseInt(num_socio) : parseInt(num_factura.substr(0, 4)),
        nombre_socio,
        sector,
        num_factura: num_factura !== "" ? num_factura.padStart(12, "0") : num_factura,
        id_factura,
        fecha,
        monto: parseFloat(monto),
        errors,
    };

    return Object.freeze(publicApi);
};

export {
    createPayment as default,
    createPayments,
    payment_api_adapter,
    payments_api_adapter,
    payment_front_adapter,
    payments_front_adapter,
};
