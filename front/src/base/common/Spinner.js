import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Spinner = ({message = ""}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            mt={2}
        >
            <CircularProgress color="primary" />
            <Typography variant="subtitle2" ml={2}>
                {message ? `${message}...` : ""}
            </Typography>
        </Box>
    );
};

export default Spinner;
