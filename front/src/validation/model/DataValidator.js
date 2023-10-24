import Validator from "./Validator";
import {DateUtil} from "base/format/utilities";

class DataValidator extends Validator {
    isNotEmpty(value) {
        if (value !== "" && value !== null && typeof value !== "undefined") {
            return null;
        }
        return "Este campo no puede estar vacío";
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
            return "Este campo no tiene un formato válido";
        }
    }

    isInteger(value) {
        if (!value || value === "") {
            return;
        }
        var integerRegExp = /^[-]?[0-9]+$/;
        if (!integerRegExp.test(value)) {
            return "Este campo no tiene un formato válido";
        }
    }

    isDecimal2(value) {
        if (!value || value === "") {
            return;
        }
        var decimalRegExp = /^-?\d+(\.\d{0,2})?$/;
        if (!decimalRegExp.test(value)) {
            return "Este campo no tiene un formato válido";
        }
    }

    isPositive(value) {
        if (value < 0) {
            return "Este valor no puede ser negativo";
        }
    }

    isHigher(max, value) {
        if (!value || value === "") {
            return;
        }
        if (value < max) {
            return "Este valor no puede ser inferior a " + max;
        }
    }

    length(length, value) {
        if (!value || value === "") {
            return;
        }
        if (value.length !== length) {
            return "Este campo debe tener " + length + " caracteres";
        }
    }

    matchesFormat(regex, format, value) {
        if (!value) {
            return;
        }
        if (!regex.test(value)) {
            return `Este campo debe tener el siguiente formato: ${format}`;
        }
    }
}

export default DataValidator;
