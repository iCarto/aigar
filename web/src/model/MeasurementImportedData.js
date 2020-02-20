class MeasurementImportedData {
    constructor(id, data) {
        this.id = id + "-" + data.sector + "-" + data.memberNumber;
        this.sector = data.sector;
        this.memberNumber = data.memberNumber;
        this.measurementDate = data.measurementDate;
        this.currentMeasurement = data.currentMeasurement;
    }
}

export default MeasurementImportedData;
