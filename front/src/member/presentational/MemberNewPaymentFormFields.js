import {useMemo, useState} from "react";
import {CURRENCY_SYMBOL} from "base/format/config/i18n";
import {
    FormInputInteger,
    FormSelect,
    FormSectionHeading,
    FormRadioGroup,
} from "base/form";
import Grid from "@mui/material/Grid";

const MemberNewPaymentFormFields = ({formData, onChange, aigarConfig}) => {
    const [isMinPaymentSelected, setIsMinPaymentSelected] = useState(false);

    const payment = useMemo(() => {
        const isHumanUse = formData?.tipo_uso?.value === "Humano";

        const maxPayment = isHumanUse
            ? aigarConfig?.humano_nuevo_derecho_total
            : aigarConfig?.comercial_nuevo_derecho_total;
        const minPayment = isHumanUse
            ? aigarConfig?.humano_nuevo_derecho_primera_cuota
            : aigarConfig?.comercial_nuevo_derecho_primera_cuota;

        return {maxPayment, minPayment};
    }, [formData?.tipo_uso?.value, aigarConfig]);

    const newMemberPaymentOptions = [
        {value: "max", label: "Pago máximo"},
        {value: "min", label: "Pago mínimo"},
    ];

    const nextFeesOptions = [...aigarConfig.nuevo_derecho_siguientes_cuotas_opciones];

    const selectedFeeValueOptions = nextFeesOptions.map(option => ({
        value: `${option} ${CURRENCY_SYMBOL}`,
        key: parseInt(option),
    }));

    const noFeesOptions = nextFeesOptions.every(option => !option);

    const paymentsToMake =
        (payment.maxPayment - payment.minPayment) / formData?.selected_fee_value?.value;

    const handleChangeField = event => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "new_member_payment" && value === "max") {
            setIsMinPaymentSelected(false);
            updateSelectedFeeValue(payment.maxPayment);
        } else {
            setIsMinPaymentSelected(true);
            updateSelectedFeeValue(value);
        }
    };

    const updateSelectedFeeValue = value => {
        onChange("selected_fee_value", value);
    };

    return (
        <>
            <FormSectionHeading>Pago del nuevo derecho</FormSectionHeading>

            <Grid container columnSpacing={1}>
                <Grid item container xs={6} alignItems="center">
                    <FormRadioGroup
                        name="new_member_payment"
                        options={newMemberPaymentOptions}
                        defaultValue={"max"}
                        onChange={handleChangeField}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormInputInteger
                        label="Importe total"
                        value={payment?.maxPayment}
                        endAdornment={CURRENCY_SYMBOL}
                        readOnly
                    />
                    <FormInputInteger
                        label="Importe inicial"
                        value={payment?.minPayment}
                        endAdornment={CURRENCY_SYMBOL}
                        readOnly
                    />
                </Grid>
            </Grid>
            {isMinPaymentSelected ? (
                <>
                    {noFeesOptions ? (
                        <FormInputInteger
                            label="Cuotas siguientes"
                            field={formData?.selected_fee_value}
                            onChange={handleChangeField}
                            endAdornment={CURRENCY_SYMBOL}
                            required
                        />
                    ) : (
                        <FormSelect
                            label="Cuotas siguientes"
                            field={formData?.selected_fee_value}
                            options={selectedFeeValueOptions}
                            onChange={handleChangeField}
                            required
                        />
                    )}
                    <FormInputInteger
                        label="Cuotas por pagar tras la factura inicial"
                        value={paymentsToMake}
                        readOnly
                    />
                </>
            ) : null}
        </>
    );
};

export default MemberNewPaymentFormFields;
