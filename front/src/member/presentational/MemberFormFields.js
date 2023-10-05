import {useDomain} from "aigar/domain/provider";
import {WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";
import {
    FormInputText,
    FormInputInteger,
    FormSelect,
    FormSelectOrder,
    FormTextArea,
} from "base/form";
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
                {formData?.id.value === -1 ? null : (
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
                <FormInputInteger
                    label="Nº personas acometida"
                    name="personas_acometida"
                    field={formData?.personas_acometida}
                    onChange={handleChangeField}
                />
                <FormSelect
                    label="Tipo de uso"
                    name="tipo_uso"
                    field={formData?.tipo_uso}
                    options={memberUseTypes}
                    onChange={handleChangeField}
                    required
                />

                <FormTextArea
                    label="Observaciones"
                    name="observaciones"
                    field={formData?.observaciones}
                    rows={7}
                    onChange={handleChangeField}
                />
            </Grid>
            <Grid item xs={5} xl={3}>
                <Grid container columnSpacing={1}>
                    <Grid item xs={8}>
                        <FormSelect
                            label="Sector"
                            name="sector"
                            field={formData?.sector}
                            options={sectors}
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
                            label={`Reducción fija de consumo (${WATER_CONSUMPTION_SYMBOL})`}
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
