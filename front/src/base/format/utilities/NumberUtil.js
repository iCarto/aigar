const NumberUtil = {
    getDecimal(number) {
        const floatNumber = parseFloat(number);
        return floatNumber.toFixed(2);
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

    formatFloat(value) {
        return parseFloat(value).toFixed(2);
    },
};

export default NumberUtil;
