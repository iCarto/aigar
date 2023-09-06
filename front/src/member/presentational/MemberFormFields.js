import {useDomain} from "aigar/domain/provider";
import {
    FormInputText,
    FormInputInteger,
    FormSelect,
    FormSelectOrder,
    FormTextArea,
} from "base/form";
import Grid from "@mui/material/Grid";
import {WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";

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
const MemberFormFields = ({formData, members, onChange, onChangeOrder}) => {
    const {sectors, memberUseTypes} = useDomain();

    const handleChangeOrder = (clickedIndex, updatedList) => {
        onChangeOrder(clickedIndex, updatedList);
    };

    const handleChangeField = event => {
        const name = event.target.name;
        const value = event.target.value;
        onChange(name, value);
    };

    return (
        <Grid container columnSpacing={{xs: 3, xl: 5}} justifyContent="center" my={2}>
            <Grid item xs={5} xl={3}>
                {formData?.num_socio.value === -1 ? null : (
                    <FormInputText
                        label="Número"
                        name="num_socio"
                        field={formData?.num_socio}
                        onChange={handleChangeField}
                        readOnly={true}
                        small={true}
                    />
                )}
                <FormInputText
                    label="Nombre"
                    name="name"
                    field={formData?.name}
                    onChange={handleChangeField}
                />

                <FormInputText
                    label="Documento Único de Identidad (DUI)"
                    name="dui"
                    field={formData?.dui}
                    onChange={handleChangeField}
                />
                <FormInputInteger
                    label="Nº personas acometida"
                    name="personas_acometida"
                    field={formData?.personas_acometida}
                    onChange={handleChangeField}
                />
                <FormSelect
                    label="Tipo de uso"
                    name="tipo_uso"
                    value={formData?.tipo_uso.value}
                    options={memberUseTypes}
                    errors={formData?.tipo_uso.errors}
                    onChange={handleChangeField}
                />

                <FormTextArea
                    label="Observaciones"
                    name="observaciones"
                    value={formData?.observaciones.value}
                    onChange={handleChangeField}
                    errors={formData?.observaciones.errors}
                />
            </Grid>
            <Grid item xs={5} xl={3}>
                <FormSelect
                    label="Sector"
                    name="sector"
                    value={formData?.sector.value}
                    options={sectors}
                    errors={formData?.sector.errors}
                    onChange={handleChangeField}
                />
                <FormInputText
                    label="Medidor"
                    name="medidor"
                    field={formData?.medidor}
                    onChange={handleChangeField}
                />
                {members && formData?.orden ? (
                    <FormSelectOrder
                        label="Orden ruta"
                        name="orden"
                        field={formData?.orden}
                        items={members}
                        onChange={handleChangeOrder}
                    />
                ) : null}
                <Grid container columnSpacing={1}>
                    <Grid item xs={6}>
                        <FormInputInteger
                            label={`Consumo máximo (${WATER_CONSUMPTION_SYMBOL})`}
                            name="consumo_maximo"
                            field={formData?.consumo_maximo}
                            onChange={handleChangeField}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormInputInteger
                            label={`Consumo reducción fija (${WATER_CONSUMPTION_SYMBOL})`}
                            name="consumo_reduccion_fija"
                            field={formData?.consumo_reduccion_fija}
                            onChange={handleChangeField}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default MemberFormFields;
