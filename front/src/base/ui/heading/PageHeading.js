import Typography from "@mui/material/Typography";

const PageHeading = ({heading, style = {}}) => {
    return (
        <Typography
            component="h1"
            variant="h6"
            sx={{textAlign: "center", textTransform: "upperCase", ...style}}
        >
            {heading}
        </Typography>
    );
};

export default PageHeading;
