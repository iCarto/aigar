class Validator {
    constructor(validations) {
        this.validations = validations;
    }

    validate(value, rules) {
        var self = this;
        const validationResults = rules.map(rule => {
            if (typeof rule === "string") {
                return self[rule](value);
            } else if (rule.param2) {
                return self[rule.type](rule.param, rule.param2, value);
            } else {
                return self[rule.type](rule.param, value);
            }
        });
        const errors = validationResults.filter(
            validationResult => validationResult != null
        );
        return errors.length > 0 ? errors : true;
    }
}

export default Validator;
