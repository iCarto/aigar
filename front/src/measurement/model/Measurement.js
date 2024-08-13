import {v4 as uuidv4} from "uuid";

class Measurements extends Array {}

const measurement_api_adapter = measurement => {
    return measurement;
};

const measurement_view_adapter = measurementOrg => {
    const measurement = {...measurementOrg};
    delete measurement["errors"];
    delete measurement["consumo"];
    // delete measurement["member_id"];
    delete measurement["member_name"];
    delete measurement["sector"];
    delete measurement["caudal_anterior_org"];
    return measurement;
};

const measurements_api_adapter = measurements =>
    measurements.map(measurement_api_adapter);

const measurements_view_adapter = measurements =>
    measurements.map(measurement_view_adapter);

const createMeasurements = (data = []) => {
    return Measurements.from(data, measurement => createMeasurement(measurement));
};

const createMeasurement = ({
    id = uuidv4(),
    invoice = null,
    sector = "",
    member_id = null,
    member_name = "",
    caudal_anterior = null,
    caudal_anterior_org = null,
    caudal_actual = null,
    cambio_medidor = false,
    medidor = "",
    errors = [],
} = {}) => {
    caudal_anterior_org =
        caudal_anterior_org != null ? caudal_anterior_org : parseInt(caudal_anterior);
    const publicApi = {
        id,
        invoice,
        member_id,
        member_name,
        sector,
        caudal_anterior_org,
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
    measurement_view_adapter,
    measurements_view_adapter,
};
