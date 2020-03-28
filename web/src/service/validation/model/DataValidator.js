import moment from "moment";
import Validator from "./Validator";

class DataValidator extends Validator {
    isNotEmpty(value) {
        if (value !== "" && value !== null && typeof value !== "undefined") {
            return null;
        }
        return "El campo no puede estar vacío";
    }

    isDate(value) {
        if (!value || value === "") {
            return;
        }
        if (!moment(value, "DD/MM/YYYY", true).isValid()) {
            return "El formato de fecha no es válido";
        }
    }

    isBoolean(value) {
        if (!value || value === "") {
            return;
        }
        if (!typeof value === "boolean") {
            return "El campo no tiene un formato válido";
        }
    }

    isInteger(value) {
        if (!value || value === "") {
            return;
        }
        var decimalRegExp = /^\d+$/;
        if (!decimalRegExp.test(value)) {
            return "El campo no tiene un formato válido";
        }
    }

    isDecimal2(value) {
        if (!value || value === "") {
            return;
        }
        var decimalRegExp = /^\d+(\.\d{1,2})?$/;
        if (!decimalRegExp.test(value)) {
            return "El campo no tiene un formato válido";
        }
    }

    length(length, value) {
        if (!value || value === "") {
            return;
        }
        if (value.length !== length) {
            return "El campo debe tener " + length + " caracteres";
        }
    }
}

export default DataValidator;
