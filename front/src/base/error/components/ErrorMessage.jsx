import Alert from "@mui/material/Alert";

const ErrorMessage = ({message, severity = "error", style = {}}) => {
    if (message) {
        return (
            <Alert severity={severity} sx={{mb: 1, ...style}}>
                {message}
            </Alert>
        );
    }
    return null;
};

export default ErrorMessage;
