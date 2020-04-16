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
    id = -1,
    factura = -1,
    sector = -1,
    num_socio = -1,
    nombre_socio = "",
    caudal_anterior = -1,
    caudal_actual = -1,
    cambio_medidor = false,
    medidor = "",
    errors = [],
} = {}) => {
    const publicApi = {
        id: num_socio,
        factura,
        num_socio,
        nombre_socio,
        sector,
        caudal_anterior: cambio_medidor === true ? 0 : parseInt(caudal_anterior),
        caudal_actual: parseInt(caudal_actual),
        consumo: caudal_actual - caudal_anterior,
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
