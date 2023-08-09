import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const SectionFieldLabel = ({labelText, labelIcon = null, tooltipText = null}) => {
    const labelStyle = {
        lineHeight: {xs: 1.5, sm: 1.75},
        color: "text.secondary",
        fontSize: "0.8rem",
        fontWeight: "regular",
        textTransform: "uppercase",
        hyphens: "auto",
    };

    const LabelIcon = labelIcon;

    return (
        <>
            {tooltipText && (
                <Tooltip title={tooltipText} arrow enterDelay={500}>
                    <InfoOutlinedIcon
                        sx={{mr: 1, color: "grey.500", fontSize: "0.9rem"}}
                    />
                </Tooltip>
            )}
            {labelIcon && (
                <LabelIcon fontSize="small" sx={{mr: 1, color: "text.secondary"}} />
            )}
            {labelText && <Typography sx={labelStyle}>{labelText}:</Typography>}
        </>
    );
};

export default SectionFieldLabel;
