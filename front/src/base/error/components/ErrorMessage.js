import Alert from "@mui/material/Alert";

const ErrorMessage = ({message}) => {
    if (message) {
        return (
            <Alert severity="error" sx={{mb: 1}}>
                {message}
            </Alert>
        );
    }
    return null;
};

export default ErrorMessage;
