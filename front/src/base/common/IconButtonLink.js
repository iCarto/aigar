const IconButtonLink = ({onClick, icon, disabled = false}) => {
    const handleClickEvent = () => {
        onClick();
    };

    return (
        <div
            style={{
                fontSize: "1.1rem",
                color: disabled ? "lightgrey" : "grey",
                cursor: disabled ? "not-allowed" : "pointer",
            }}
            onClick={!disabled ? handleClickEvent : undefined}
        >
            <i className={"fa fa-" + icon} />
        </div>
    );
};

export default IconButtonLink;
