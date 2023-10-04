import Alert from "@mui/material/Alert";

const ErrorMessage = ({message, style = {}}) => {
    if (message) {
        return (
            <Alert severity="error" sx={{mb: 1, ...style}}>
                {message}
            </Alert>
        );
    }
    return null;
};

export default ErrorMessage;
