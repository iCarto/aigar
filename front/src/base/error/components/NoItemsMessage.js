import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const NoItemsMessage = ({itemsLength, message = ""}) => {
    const noElementsMessage = message || "No existen elementos para mostrar.";

    return !itemsLength ? (
        <Grid container justifyContent="center" my={6}>
            <Typography py={12} sx={{fontStyle: "italic", textAlign: "center"}}>
                {noElementsMessage}
            </Typography>
        </Grid>
    ) : null;
};

export default NoItemsMessage;
