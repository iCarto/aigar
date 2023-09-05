import {
    SectionField,
    SectionFieldLabel,
    SectionFieldValue,
    SectionSummaryCard,
} from "base/ui/section/presentational";
import {MemberTypeField} from "member/presentational";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const MemberDetail = ({member, isSummary = false}) => {
    const message = !member?.is_active ? (
        <Alert severity="error" sx={{mb: 2}}>
            Este socio se encuentra eliminado del sistema.
        </Alert>
    ) : null;

    return member ? (
        <SectionSummaryCard>
            <Grid item xs={12}>
                {message}
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Nombre"
                    value={member?.name}
                    highlightValue
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Nº socio/a"
                    value={member?.num_socio}
                    highlightValue
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Tipo de socio/a"
                    value={<MemberTypeField memberType={member?.tipo_socio} />}
                    containerWidth="short"
                    highlightValue
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Medidor"
                    value={member?.medidor}
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Sector"
                    value={`${member?.sector}`}
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Orden"
                    value={member?.orden}
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Consumo máximo"
                    value={member?.consumo_maximo}
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Consumo reducción fija"
                    value={member?.consumo_reduccion_fija}
                    containerWidth="short"
                />
            </Grid>
            {isSummary ? null : (
                <Grid item container xs={12} columnSpacing={2}>
                    <Grid item container xs="auto" sm={3} alignItems="flex-start">
                        <SectionFieldLabel labelText="Observaciones" />
                    </Grid>
                    <Grid item container xs="auto" sm alignItems="flex-start">
                        <SectionFieldValue value={member?.observaciones} />
                    </Grid>
                </Grid>
            )}
        </SectionSummaryCard>
    ) : null;
};

export default MemberDetail;
