import Validator from "./Validator";
import {DateUtil} from "utilities";

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
        if (!DateUtil.isValidForDataLoad(value)) {
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
        var integerRegExp = /^[-]?[0-9]+$/;
        if (!integerRegExp.test(value)) {
            return "El campo no tiene un formato válido";
        }
    }

    isDecimal2(value) {
        if (!value || value === "") {
            return;
        }
        var decimalRegExp = /^-?\d+(\.\d{0,2})?$/;
        if (!decimalRegExp.test(value)) {
            return "El campo no tiene un formato válido";
        }
    }

    isPositive(value) {
        if (value < 0) {
            return "El valor no puede ser negativo";
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
