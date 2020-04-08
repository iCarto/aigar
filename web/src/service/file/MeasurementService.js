import {createMeasurement, measurement_api_adapter} from "model";
const MeasurementsService = {
    getMeasurementsFromJSONContent: function(content) {
        const jsonMeasurements = JSON.parse(content);
        console.log(jsonMeasurements);
        return Promise.resolve(
            jsonMeasurements.map(jsonMeasurement => {
                // TODO Deberíamos poder utilizar los valores por defecto sin tener que invocarlos
                // aquí y delegarlo en la creación del objeto
                return createMeasurement(
                    measurement_api_adapter({
                        sector: jsonMeasurement.sector,
                        num_socio: jsonMeasurement.num_socio,
                        nombre_socio: jsonMeasurement.name,
                        caudal_anterior: jsonMeasurement.lectura_anterior,
                        caudal_actual: jsonMeasurement.lectura,
                    })
                );
            })
        );
    },

    mergeFileContents(contents) {
        const jsonContentArrays = contents.map(content => JSON.parse(content));
        return jsonContentArrays.flat();
    },
};

export default MeasurementsService;
