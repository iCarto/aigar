module.exports = {
    defaultSeverity: "error",

    plugins: ["stylelint-order"],
    extends: ["stylelint-config-standard", "stylelint-config-html"],
    rules: {
        "order/properties-alphabetical-order": true,
        "font-family-name-quotes": "always-unless-keyword",
        "function-url-quotes": "always",
        "selector-attribute-quotes": "always",

        "no-descending-specificity": null,

        "function-calc-no-unspaced-operator": true,
    },

    // https://stylelint.io/user-guide/configuration/#ignorefiles
    // `ignorePath` and `ignorePattern` work in the cli, but not here
    // https://github.com/stylelint/stylelint/issues/4126
    // ignorePath: ".ignore",
    // ignorePattern: ["static/vendor"],
};
