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
        return this.validateEntry(
            entryObject,
            new DataValidator({
                name: ["isNotEmpty"],
            })
        );
    },

    validateInvoice(entryObject) {
        return this.validateEntry(
            entryObject,
            new DataValidator({
                numero: ["isNotEmpty"],
                consumo: ["isNotEmpty"],
            })
        );
    },
};

export default DataValidatorService;
