import {createMeasurement, measurement_api_adapter} from "model";
import {LoadDataValidatorService} from "service/validation";

const MeasurementsService = {
    getMeasurementsFromJSONContent: function(content) {
        const jsonMeasurements = JSON.parse(content);
        console.log(jsonMeasurements);
        return Promise.resolve(
            jsonMeasurements.map(jsonMeasurement => {
                // TODO Deberíamos poder utilizar los valores por defecto sin tener que invocarlos
                // aquí y delegarlo en la creación del objeto
                const measurementData = measurement_api_adapter({
                    sector: jsonMeasurement.sector,
                    num_socio: jsonMeasurement.num_socio,
                    nombre_socio: jsonMeasurement.name,
                    lectura_anterior: jsonMeasurement.lectura_anterior || "",
                    lectura: jsonMeasurement.lectura || "",
                    num_contador: jsonMeasurement.num_contador || "",
                    cambio_contador: jsonMeasurement.cambio_contador,
                });
                return createMeasurement({
                    ...measurementData,
                    errors: LoadDataValidatorService.validateMeasurementEntry(
                        measurementData
                    ),
                });
            })
        );
        /*return MemberService.getMembers().then(members => {
            const lines = content.split(/\r\n|\r|\n/g);
            let measurements = [];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() !== "") {
                    const measurementRead = lines[i].split(";");
                    const num_socio = measurementRead[1]
                        ? parseInt(measurementRead[1])
                        : -1;
                    const member = members.find(
                        member => member.num_socio === num_socio
                    );
                    const nombre_socio = member ? member.name : null;

                    const measurementData = measurement_api_adapter({
                        sector: measurementRead[0],
                        num_socio,
                        nombre_socio,
                        fecha_lectura: measurementRead[2],
                        caudal_actual: measurementRead[3],
                    });
                    const measurement = createMeasurement({
                        ...measurementData,
                        errors: LoadDataValidatorService.validateMeasurementEntry(
                            measurementData
                        ),
                    });
                    measurements.push(measurement);
                }
            }
            return measurements;
        });*/
    },
};

export default MeasurementsService;
