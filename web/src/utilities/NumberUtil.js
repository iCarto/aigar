const NumberUtil = {
    getDecimal(number) {
        const floatNumber = parseFloat(number);
        return floatNumber.toFixed(2);
    },

    parseFloatOrNull(value) {
        if (value == null || isNaN(value)) {
            return "";
        }
        return parseFloat(value);
    },

    parseIntOrNull(value) {
        if (value == null || isNaN(value)) {
            return "";
        }
        return parseInt(value);
    },
};

export default NumberUtil;
