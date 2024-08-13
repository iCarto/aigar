const AlertType = {
    ERROR: "error",
    WARNING: "warning",
};

class AlertMessageType {
    constructor(type, message) {
        if (!Object.values(AlertType).includes(type)) {
            throw new Error(`Invalid alert type: ${type}`);
        }
        this.type = type;
        this.message = message;
    }

    toString() {
        return this.message;
    }
}

class ErrorMessageType extends AlertMessageType {
    constructor(message) {
        super(AlertType.ERROR, message);
    }
}

class WarningMessageType extends AlertMessageType {
    constructor(message) {
        super(AlertType.WARNING, message);
    }
}

const createAlertMessage = (type, message) => {
    switch (type) {
        case AlertType.ERROR:
            return new ErrorMessageType(message);
        case AlertType.WARNING:
            return new WarningMessageType(message);
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
