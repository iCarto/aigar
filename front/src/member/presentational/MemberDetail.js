import {useGetSectorReadingDay} from "aigar/domain/hooks";
import {WATER_CONSUMPTION_SYMBOL} from "base/format/config/i18n";
import {USE_TYPES_MAPPING, MEMBER_TYPES_MAPPING} from "member/config";
import {ValueWithIcon} from "base/ui/other/components";
import {
    SectionField,
    SectionFieldLabel,
    SectionFieldValue,
    SectionSummaryCard,
} from "base/ui/section/components";
import {ErrorMessage} from "base/error/components";
import {TextLink} from "base/navigation/components";
import Grid from "@mui/material/Grid";

const MemberDetail = ({member, isSummary = false}) => {
    const readingDay = useGetSectorReadingDay(member?.sector);

    const deletedMemberMessage = member?.isDeleted ? (
        <Grid item xs={12}>
            <ErrorMessage message="Este socio se encuentra eliminado del sistema." />
        </Grid>
    ) : null;

    const getMemberNameValue = () => {
        if (isSummary) {
            return (
                <TextLink
                    text={`${member?.name} - ${member?.id}`}
                    to={`/socios/${member?.id}`}
                />
            );
        }
        return `${member?.name} - ${member?.id}`;
    };

    const fields = [
        {
            label: "Nombre y nº socio/a",
            value: getMemberNameValue(),
            highlightValue: true,
        },
        !isSummary && {
            label: "DUI",
            value: member?.dui,
        },
        {
            label: "Tipo de socio/a",
            value: (
                <ValueWithIcon
                    icon={MEMBER_TYPES_MAPPING[member?.status]?.icon}
                    value={MEMBER_TYPES_MAPPING[member?.status]?.label}
                />
            ),
            highlightValue: true,
        },
        !isSummary && {
            label: "Nº personas acometida",
            value: member?.personas_acometida,
        },
        {
            label: "Tipo de uso",
            value: (
                <ValueWithIcon
                    icon={USE_TYPES_MAPPING[member?.tipo_uso]?.icon}
                    value={USE_TYPES_MAPPING[member?.tipo_uso]?.label}
                />
            ),
        },
        {
            label: "Sector y día lectura",
            value: readingDay ? `${member?.sector} • Día ${readingDay}` : null,
        },
        !isSummary && {
            label: "Medidor",
            value: member?.medidor,
        },
        !isSummary && {
            label: "Orden",
            value: member?.orden,
        },
        {
            label: "Consumo máximo",
            value: member?.consumo_maximoinvoicedetailsho
                ? `${member?.consumo_maximo} ${WATER_CONSUMPTION_SYMBOL}`
                : "",
        },
        {
            label: "Reducción fija de consumo",
            value: member?.consumo_reduccion_fija
                ? `${member?.consumo_reduccion_fija} ${WATER_CONSUMPTION_SYMBOL}`
                : "",
        },
    ];

    return member ? (
        <SectionSummaryCard>
            {deletedMemberMessage}
            {fields.map(
                (field, index) =>
                    field && (
                        <Grid item xs={6} key={index}>
                            <SectionField
                                label={field.label}
                                value={field.value}
                                highlightValue={field.highlightValue}
                                containerWidth="short"
                            />
                        </Grid>
                    )
            )}
            {!isSummary && (
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
