import MeasurementImportedData from "model/MeasurementImportedData";

const MeasurementsService = {
    getMeasurementsFromCSVContent: function(content) {
        let lines = content.split(/\r\n|\r|\n/g);
        let measurements = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
                let measurementRead = lines[i].split(";");
                let measurement = new MeasurementImportedData(i, {
                    sector: measurementRead[0],
                    memberNumber: measurementRead[1],
                    measurementDate: measurementRead[2],
                    currentMeasurement: measurementRead[3],
                    errors: [],
                });
                measurements.push(measurement);
            }
        }
        return measurements;
    },
};

export default MeasurementsService;
