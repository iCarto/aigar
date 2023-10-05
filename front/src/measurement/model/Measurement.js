class Measurements extends Array {}

const measurement_api_adapter = measurement => {
    return measurement;
};

const measurements_api_adapter = measurments =>
    measurments.map(measurement_api_adapter);

const createMeasurements = (data = []) => {
    const members = Measurements.from(data, measurement =>
        createMeasurement(measurement)
    );
    return members;
};

const createMeasurement = ({
    id = null,
    factura = null,
    sector = "",
    member_id = null,
    member_name = "",
    caudal_anterior = null,
    caudal_actual = null,
    cambio_medidor = false,
    medidor = "",
    errors = [],
} = {}) => {
    const publicApi = {
        id: id,
        factura,
        member_id,
        member_name,
        sector,
        caudal_anterior: cambio_medidor === true ? 0 : parseInt(caudal_anterior),
        caudal_actual,
        consumo:
            caudal_actual != null && caudal_anterior != null
                ? caudal_actual - caudal_anterior
                : "",
        cambio_medidor,
        medidor,
        errors,
    };

    return Object.freeze(publicApi);
};

export {
    createMeasurement as default,
    createMeasurements,
    measurement_api_adapter,
    measurements_api_adapter,
};
