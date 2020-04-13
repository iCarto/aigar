const NumberUtil = {
    getDecimal(number) {
        const floatNumber = parseFloat(number);
        return floatNumber.toFixed(2);
    },
};

export default NumberUtil;
