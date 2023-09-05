import Alert from "@mui/material/Alert";

const ErrorMessage = ({message}) => {
    if (message) {
        return <Alert severity="error">{message}</Alert>;
    }
    return null;
};

export default ErrorMessage;
