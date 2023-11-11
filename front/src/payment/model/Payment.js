import {v4 as uuidv4} from "uuid";
import {DateUtil} from "base/format/utilities";

class Payments extends Array {}

const payment_view_adapter = paymentOrg => {
    const payment = {
        ...paymentOrg,
        fecha: DateUtil.parse(paymentOrg["fecha"]),
        monto: parseFloat(paymentOrg["monto"]),
    };
    delete payment["errors"];
    delete payment["num_factura"];
    delete payment["member_name"];
    delete payment["member_id"];
    delete payment["sector"];
    return payment;
};

const payment_api_adapter = payment => {
    payment["fecha"] = DateUtil.format(payment["fecha"]);
    return payment;
};

const payments_view_adapter = payments => payments.map(payment_view_adapter);

const payments_api_adapter = payments => payments.map(payment_api_adapter);

const createPayments = (data = []) => {
    return Payments.from(data, payment => createPayment(payment));
};

const createPayment = ({
    id = uuidv4(),
    invoice = null,
    sector = "",
    member_id = null,
    member_name = "",
    fecha = null,
    monto = null,
    num_factura = "",
    errors = [],
} = {}) => {
    const publicApi = {
        id,
        invoice,
        member_id,
        member_name,
        sector,
        fecha,
        monto,
        num_factura: num_factura !== "" ? num_factura.padStart(12, "0") : num_factura,
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
