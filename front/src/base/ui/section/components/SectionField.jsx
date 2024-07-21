import {SectionFieldLabel, SectionFieldValue} from ".";
import Grid from "@mui/material/Grid";

const SectionField = ({
    label = null,
    value = null,
    unit = "",
    labelIcon = null,
    containerWidth = "",
    valueCustomStyle = {},
    highlightValue = false,
    linkPath = null,
    editButton = false,
    editButtonPath = "",
    helperText = "",
    tooltipText = null,
}) => {
    let labelWidth;
    let valueWidth;

    switch (`${containerWidth}`) {
        case "long":
            labelWidth = 9;
            valueWidth = editButton ? 2 : 3;
            break;
        case "short":
            labelWidth = editButton ? 5 : 6;
            valueWidth = 6;
            break;
        default:
            labelWidth = 5;
            valueWidth = editButton ? 6 : 7;
            break;
    }

    return (
        <Grid container columnSpacing={containerWidth === "long" ? 2 : 1}>
            <Grid
                item
                container
                xs="auto"
                sm={5}
                lg={labelWidth}
                alignItems="flex-start"
            >
                <SectionFieldLabel
                    labelText={label}
                    labelIcon={labelIcon}
                    tooltipText={tooltipText}
                />
            </Grid>
            <Grid
                item
                container
                xs="auto"
                sm={6}
                lg={valueWidth}
                alignItems="flex-start"
            >
                <SectionFieldValue
                    value={value}
                    unit={unit}
                    valueCustomStyle={valueCustomStyle}
                    highlightValue={highlightValue}
                    linkPath={linkPath}
                    editButton={editButton}
                    editButtonPath={editButtonPath}
                    helperText={helperText}
                />
            </Grid>
        </Grid>
    );
};

export default SectionField;
