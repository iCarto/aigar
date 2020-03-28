class Measurements extends Array {}

const measurement_api_adapter = measurement => {
    /*measurement["nombre_socio"] = getNombreSocio(
        measurement.num_socio
    );*/
    measurement["id"] = measurement.num_socio;
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
    sector = -1,
    num_socio = -1,
    nombre_socio = "",
    lectura_anterior = -1,
    lectura = -1,
    num_contador = -1,
    cambio_contador = false,
    errors = [],
} = {}) => {
    const publicApi = {
        id,
        num_socio,
        nombre_socio,
        sector,
        lectura_anterior,
        lectura,
        num_contador,
        cambio_contador,
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
