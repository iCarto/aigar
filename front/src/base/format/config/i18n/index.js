//Date formats

export const DATE_FORMATS = {
    BANK_DATEFORMAT: "DD/MM/YYYY",
    TIGO_DATEFORMAT: "YYYYMMDD",
    API_DATEFORMAT: "YYYY-MM-DD",
};

// Number formats

export const DECIMAL_SEPARATOR = ".";
export const THOUSAND_SEPARATOR = ",";
export const CURRENCY_SYMBOL = "$";
export const localCurrencyFormatter = new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
});
export const localNumberFormatter = new Intl.NumberFormat("es-SV", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
