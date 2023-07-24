const ErrorMessage = ({message}) => {
    if (message) {
        return <div className="alert alert-danger">{message}</div>;
    }
    return null;
};

export default ErrorMessage;
