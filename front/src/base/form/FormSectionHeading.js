import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";

const FormSectionHeading = ({children}) => {
    const theme = useTheme();
    return (
        <Typography
            variant="h6"
            color="grey.700"
            mt={2}
            mb={1}
            sx={{
                fontSize: theme.typography.fontSize,
                textTransform: "uppercase",
                fontWeight: 500,
            }}
        >
            {children}
        </Typography>
    );
};

export default FormSectionHeading;
