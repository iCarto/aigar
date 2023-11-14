//Date formats

// Number formats

export const DECIMAL_SEPARATOR = ".";
export const THOUSAND_SEPARATOR = ",";
export const CURRENCY_SYMBOL = "$";
export const WATER_CONSUMPTION_SYMBOL = "㎥";
export const localCurrencyFormatter = new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
});
export const localNumberFormatter = new Intl.NumberFormat("es-SV", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
