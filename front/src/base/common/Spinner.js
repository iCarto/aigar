const Spinner = ({message = ""}) => {
    return (
        <div className="h-100 text-center d-flex align-items-center justify-content-center mt-3">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">{message}...</span>
            </div>
            <strong className="ml-3">{message ? message + "..." : ""}</strong>
        </div>
    );
};

export default Spinner;
