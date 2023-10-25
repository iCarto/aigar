import {WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";
import {
    FormInputText,
    FormInputInteger,
    FormSelect,
    FormSelectOrder,
    FormTextArea,
} from "base/form";
import {MemberNewPaymentFormFields} from ".";
import Grid from "@mui/material/Grid";

/**
Controlled component for member form.

Props:
- @property formData: object including an object with name & value for each form field.
- @property members: list of members with their order number
- @property onChange: call handler function when a field changes its value
- @property onChangeOrder: call handler function when the members list changes its order

The component responsability is to render object fields inside proper form fields
and show errors related with every field.

This component doesn't manage state because the state is stored in the parent component.
*/
const MemberFormFields = ({
    formData,
    members,
    isNewMember,
    onChange,
    onChangeOrder,
    domains,
}) => {
    const handleChangeField = event => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    };

    const handleChangeOrder = (clickedIndex, updatedList) => {
        onChangeOrder(clickedIndex, updatedList);
    };

    // Allows to re-order form fields if Payments section is not rendered
    const formFieldsForNewMember = (
        <>
            <Grid container columnSpacing={1}>
                <Grid item xs={8}>
                    <FormSelect
                        label="Sector"
                        name="sector"
                        field={formData?.sector}
                        options={domains.sectors}
                        onChange={handleChangeField}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormInputInteger
                        label="Día de lectura"
                        name="reading_day"
                        field={formData?.reading_day}
                        onChange={handleChangeField}
                        readOnly
                    />
                </Grid>
            </Grid>
            <FormInputText
                label="Medidor"
                name="medidor"
                field={formData?.medidor}
                onChange={handleChangeField}
            />
        </>
    );

    return (
        <Grid item container justifyContent="center" mb={2}>
            <Grid item container spacing={4} justifyContent="center">
                <Grid item xs={6} xl={3}>
                    {isNewMember ? null : (
                        <FormInputInteger
                            label="Número"
                            name="id"
                            field={formData?.id}
                            onChange={handleChangeField}
                            readOnly
                        />
                    )}
                    <FormInputText
                        label="Nombre"
                        name="name"
                        field={formData?.name}
                        onChange={handleChangeField}
                        required
                    />
                    <FormInputText
                        label="Documento Único de Identidad (DUI)"
                        name="dui"
                        field={formData?.dui}
                        onChange={handleChangeField}
                        maxLength={10}
                    />
                    <FormSelect
                        label="Tipo de uso"
                        name="tipo_uso"
                        field={formData?.tipo_uso}
                        options={domains.memberUseTypes}
                        onChange={handleChangeField}
                        required
                    />
                    <FormInputInteger
                        label="Nº personas acometida"
                        name="personas_acometida"
                        field={formData?.personas_acometida}
                        onChange={handleChangeField}
                    />
                    {isNewMember ? (
                        <MemberNewPaymentFormFields
                            formData={formData}
                            onChange={onChange}
                            basicConfig={domains.basicConfig}
                        />
                    ) : (
                        formFieldsForNewMember
                    )}
                </Grid>
                <Grid item xs={6} xl={3}>
                    {isNewMember ? formFieldsForNewMember : null}
                    {members && formData?.orden ? (
                        <FormSelectOrder
                            label="Orden en la ruta de lectura de medidores"
                            name="orden"
                            field={formData?.orden}
                            items={members}
                            onChange={handleChangeOrder}
                        />
                    ) : null}
                    <FormInputInteger
                        label={`Consumo máximo (${WATER_CONSUMPTION_SYMBOL})`}
                        name="consumo_maximo"
                        field={formData?.consumo_maximo}
                        onChange={handleChangeField}
                    />
                    <FormInputInteger
                        label={`Reducción fija de consumo (${WATER_CONSUMPTION_SYMBOL})`}
                        name="consumo_reduccion_fija"
                        field={formData?.consumo_reduccion_fija}
                        onChange={handleChangeField}
                    />
                </Grid>
            </Grid>
            <Grid item container xs={6} px={1}>
                <FormTextArea
                    label="Observaciones"
                    name="observaciones"
                    field={formData?.observaciones}
                    rows={4}
                    onChange={handleChangeField}
                />
            </Grid>
        </Grid>
    );
};

export default MemberFormFields;
