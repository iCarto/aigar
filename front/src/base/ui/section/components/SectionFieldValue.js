import {useNavigate} from "react-router-dom";

import {TextLink} from "base/navigation/components";
import {SectionFieldEditButton, SectionFieldHelpText} from ".";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Unit = ({unit}) => {
    return (
        <Typography
            variant="subtitle1"
            component="p"
            sx={{
                lineHeight: {xs: 1.85, sm: 1.65},
                ml: 1,
                overflowWrap: "break-word",
                whiteSpace: "pre-line;",
                color: "grey",
            }}
        >
            {unit}
        </Typography>
    );
};

const SectionField = ({
    value,
    unit = "",
    valueCustomStyle = {},
    highlightValue = false,
    linkPath = null,
    editButton = false,
    editButtonPath = "",
    helperText = "",
}) => {
    const navigate = useNavigate();

    const valueStyle = {
        overflowWrap: "break-word",
        lineHeight: {xs: 1.5, sm: 1.75},
        fontWeight: highlightValue ? "600" : "regular",
        ...valueCustomStyle,
    };

    const regularField = (
        <>
            <Typography variant="subtitle2" component="p" sx={valueStyle}>
                {value}
            </Typography>
            {helperText && <SectionFieldHelpText text={helperText} />}
            {unit && <Unit unit={unit} />}
        </>
    );

    const linkField = <TextLink text={value} to={linkPath} />;

    const emptyField = (
        <Typography variant="subtitle2" component="p" sx={{...valueStyle}}>
            —
        </Typography>
    );

    const isValueValid = value || value === 0;
    const field = linkPath ? linkField : regularField;

    return (
        <>
            <Grid item>{isValueValid ? field : emptyField}</Grid>
            {editButton ? (
                <Grid item xs>
                    <SectionFieldEditButton onClick={navigate(editButtonPath)} />
                </Grid>
            ) : null}
        </>
    );
};

export default SectionField;
