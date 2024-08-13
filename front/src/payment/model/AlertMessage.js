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

export {AlertType, ErrorMessageType, WarningMessageType, createAlertMessage};
