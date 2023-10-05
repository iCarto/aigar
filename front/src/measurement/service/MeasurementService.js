import {createMeasurement, measurement_api_adapter} from "measurement/model";

const MeasurementsService = {
    getMeasurementsFromJSONContent: function (content) {
        const jsonMeasurements = JSON.parse(content);
        console.log(jsonMeasurements);
        return Promise.resolve(
            jsonMeasurements
                .map(jsonMeasurement => {
                    // TODO Deberíamos poder utilizar los valores por defecto sin tener que invocarlos
                    // aquí y delegarlo en la creación del objeto
                    if (jsonMeasurement.lectura == null) {
                        return null;
                    }
                    return createMeasurement(
                        measurement_api_adapter({
                            sector: jsonMeasurement.sector,
                            member_id: jsonMeasurement.member_id,
                            member_name: jsonMeasurement.member_name,
                            caudal_anterior: jsonMeasurement.lectura_anterior,
                            caudal_actual: jsonMeasurement.lectura,
                            medidor: jsonMeasurement.medidor,
                            cambio_medidor: jsonMeasurement.cambio_medidor,
                        })
                    );
                })
                .filter(jsonMeasurement => jsonMeasurement != null)
        );
    },

    mergeFileContents(contents) {
        const jsonContentArrays = contents.map(content => JSON.parse(content));
        return jsonContentArrays.flat();
    },
};

export default MeasurementsService;
