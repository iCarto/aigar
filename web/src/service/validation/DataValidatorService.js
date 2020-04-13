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
                caudal_anterior: ["isNotEmpty", "isInteger", "isPositive"],
                caudal_actual: ["isNotEmpty", "isInteger", "isPositive"],
                cuota_fija: ["isNotEmpty", "isDecimal2", "isPositive"],
                cuota_variable: ["isNotEmpty", "isDecimal2", "isPositive"],
                comision: ["isNotEmpty", "isDecimal2", "isPositive"],
                ahorro: ["isNotEmpty", "isDecimal2", "isPositive"],
                asamblea: ["isNotEmpty", "isDecimal2", "isPositive"],
                derecho: ["isNotEmpty", "isDecimal2", "isPositive"],
                reconexion: ["isNotEmpty", "isDecimal2", "isPositive"],
                mora: ["isNotEmpty", "isDecimal2", "isPositive"],
                descuento: ["isNotEmpty", "isDecimal2", "isPositive"],
                total: ["isNotEmpty", "isDecimal2"],
            })
        );
    },
};

export default DataValidatorService;
