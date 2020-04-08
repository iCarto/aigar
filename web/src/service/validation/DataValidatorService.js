import DataValidator from "./model/DataValidator";

const DataValidatorService = {
    validateEntry(entryObject, validator) {
        let errors = [];
        Object.keys(validator.validations).forEach(validationAttr => {
            let validationErrors = validator.validate(
                entryObject[validationAttr],
                validator.validations[validationAttr]
            );
            if (validationErrors.length > 0) {
                validationErrors.forEach(validationError => {
                    errors.push({
                        id: entryObject.id,
                        type: "error",
                        field: validationAttr,
                        msg: validationError,
                    });
                });
            }
        });
        return errors;
    },

    validateMember(entryObject) {
        return DataValidatorService.validateEntry(
            entryObject,
            new DataValidator({
                name: ["isNotEmpty"],
            })
        );
    },

    validateInvoice(entryObject) {
        return DataValidatorService.validateEntry(
            entryObject,
            new DataValidator({
                numero: ["isNotEmpty"],
                consumo: ["isNotEmpty", "isInteger"],
                caudal_anterior: ["isNotEmpty", "isInteger"],
                caudal_actual: ["isNotEmpty", "isInteger"],
                cuota_fija: ["isNotEmpty", "isDecimal2"],
                cuota_variable: ["isNotEmpty", "isDecimal2"],
                comision: ["isNotEmpty", "isDecimal2"],
                ahorro: ["isNotEmpty", "isDecimal2"],
                asamblea: ["isNotEmpty", "isDecimal2"],
                derecho: ["isNotEmpty", "isDecimal2"],
                reconexion: ["isNotEmpty", "isDecimal2"],
                mora: ["isNotEmpty", "isDecimal2"],
                total: ["isNotEmpty", "isDecimal2"],
            })
        );
    },
};

export default DataValidatorService;
