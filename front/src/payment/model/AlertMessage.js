const AlertType = {
    ERROR: "error",
    WARNING: "warning",
};

class AlertMessageType {
    constructor(type, message, field) {
        if (!Object.values(AlertType).includes(type)) {
            throw new Error(`Invalid alert type: ${type}`);
        }
        this.type = type;
        this.message = message;
        this.field = field;
    }

    toString() {
        return this.message;
    }
}

class ErrorMessageType extends AlertMessageType {
    constructor(message, field) {
        super(AlertType.ERROR, message, field);
    }
}

class WarningMessageType extends AlertMessageType {
    constructor(message, field) {
        super(AlertType.WARNING, message, field);
    }
}

const createAlertMessage = (type, message, field = null) => {
    switch (type) {
        case AlertType.ERROR:
            return new ErrorMessageType(message, field);
        case AlertType.WARNING:
            return new WarningMessageType(message, field);
        default:
            throw new Error(`Invalid alert type: ${type}`);
    }
};

const getTotalErrors = items => {
    return items.filter(
        item => item.errors.length !== 0 && item.errors[0].type === "error"
    ).length;
};

const getTotalWarnings = items => {
    return items.filter(
        item => item.errors.length !== 0 && item.errors[0].type === "warning"
    ).length;
};

export {createAlertMessage, getTotalErrors, getTotalWarnings};
