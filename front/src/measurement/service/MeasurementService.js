import {createMeasurement, measurement_api_adapter} from "measurement/model";

const MeasurementsService = {
    getMeasurements: function (jsonMeasurements) {
        return Promise.resolve(
            jsonMeasurements
                .map(jsonMeasurement => {
                    // TODO Deberíamos poder utilizar los valores por defecto sin tener que invocarlos
                    // aquí y delegarlo en la creación del objeto
                    if (jsonMeasurement.caudal_actual == null) {
                        return null;
                    }
                    return createMeasurement(
                        measurement_api_adapter({...jsonMeasurement})
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
