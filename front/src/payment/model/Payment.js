import {DateUtil} from "base/format/utilities";

class Payments extends Array {}

const payment_api_adapter = payment => {
    return {
        id_factura: payment["id_factura"],
        fecha: DateUtil.parse(payment["fecha"]),
        monto: parseFloat(payment["monto"]),
    };
};

const payment_front_adapter = payment => {
    payment["fecha"] = DateUtil.format(payment["fecha"]);
    payment["id_factura"] = payment["factura"];

    return payment;
};

const payments_api_adapter = payments => payments.map(payment_api_adapter);

const payments_front_adapter = payments => payments.map(payment_front_adapter);

const createPayments = (data = []) => {
    const members = Payments.from(data, payment => createPayment(payment));
    return members;
};

const createPayment = ({
    id_pago = -1,
    fecha = -1,
    monto = -1,
    num_socio = -1,
    nombre_socio = "",
    sector = -1,
    num_factura = "",
    id_factura = -1,
    errors = [],
} = {}) => {
    const publicApi = {
        // id_pago es el id que llega del back y se guarda en BD. Las propiedades fecha y monto también están en BD; el resto de campos solo se usan en el front.
        id_pago,
        fecha,
        monto,
        // Este id se genera para controlar la edición del nº factura o fecha en la tabla de importación de pagos (LoadPaymentsStep2PaymentsTable). No está en BD.
        id: num_factura + fecha,
        num_socio:
            num_socio !== -1 ? parseInt(num_socio) : parseInt(num_factura.substr(0, 4)),
        nombre_socio,
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
    payment_api_adapter,
    payments_api_adapter,
    payment_front_adapter,
    payments_front_adapter,
};
