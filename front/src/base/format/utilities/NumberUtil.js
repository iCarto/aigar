import {localCurrencyFormatter, localNumberFormatter} from "../config/i18n";

const NumberUtil = {
    defaultEmpty: " - ",

    isNumber(field) {
        // http://stackoverflow.com/a/1830844/854308
        return !isNaN(parseFloat(field)) && isFinite(field);
    },

    formatFloat(value) {
        if (isNaN(value) || value === 0) {
            return value;
        } else if (!value) {
            return "";
        }
        const floatNumber = parseFloat(value);

        return localNumberFormatter.format(floatNumber);
    },

    formatInteger(value) {
        if (value || value === 0) {
            return localNumberFormatter.format(value);
        }
    },

    formatNumber(value) {
        if (value || value === 0) {
            if (Number.isInteger(value)) {
                return this.formatInteger(value);
            } else {
                return this.formatFloat(value);
            }
        }
    },

    parseFloatOrNull(value) {
        if (value == null) {
            return "";
        }
        if (value === "") {
            return 0;
        }
        if (isNaN(value)) {
            return value;
        }
        return parseFloat(value);
    },

    parseIntOrNull(value) {
        // FIXME
        if (value == null) {
            return "";
        }
        if (value === "") {
            return 0;
        }
        if (isNaN(value)) {
            return value;
        }
        return parseInt(value);
    },

    formatCurrency(value, showCurrencySymbol = true) {
        if (!this.isNumber(value)) return this.defaultEmpty;

        let formatter = showCurrencySymbol
            ? localCurrencyFormatter
            : localNumberFormatter;
        return formatter.format(value);
    },
};

export default NumberUtil;
