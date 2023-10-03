import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {USE_TYPES_MAPPING, MEMBER_TYPES_MAPPING} from "member/config";
import {ValueWithIcon} from "base/common";
import {
    SectionField,
    SectionFieldLabel,
    SectionFieldValue,
    SectionSummaryCard,
} from "base/ui/section/presentational";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import {WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";

const MemberDetail = ({member, isSummary = false}) => {
    const readingDay = useGetSectorReadingDay(member.sector);

    const message = member?.isDeleted ? (
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
                    label="Nombre y nº socio/a"
                    value={`${member?.name} - ${member?.num_socio}`}
                    highlightValue
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField label="DUI" value={member?.dui} containerWidth="short" />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Tipo de socio/a"
                    value={
                        <ValueWithIcon
                            icon={MEMBER_TYPES_MAPPING[member?.status]?.icon}
                            value={MEMBER_TYPES_MAPPING[member?.status]?.label}
                        />
                    }
                    containerWidth="short"
                    highlightValue
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Nº personas acometida"
                    value={member?.personas_acometida}
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Tipo de uso"
                    value={
                        <ValueWithIcon
                            icon={USE_TYPES_MAPPING[member?.tipo_uso]?.icon}
                            value={USE_TYPES_MAPPING[member?.tipo_uso]?.label}
                        />
                    }
                    containerWidth="short"
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
                {readingDay ? (
                    <SectionField
                        label="Sector y día lectura"
                        value={`${member?.sector} • Día ${readingDay}`}
                        containerWidth="short"
                    />
                ) : null}
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
                    value={
                        member?.consumo_maximo
                            ? `${member?.consumo_maximo} ${WATER_CONSUMPTION_SYMBOL}`
                            : ""
                    }
                    containerWidth="short"
                />
            </Grid>
            <Grid item xs={6}>
                <SectionField
                    label="Reducción fija de consumo"
                    value={
                        member?.consumo_reduccion_fija
                            ? `${member?.consumo_reduccion_fija} ${WATER_CONSUMPTION_SYMBOL}`
                            : ""
                    }
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
