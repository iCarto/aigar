const WizardButtons = ({
    currentStep,
    numberOfSteps,
    isValidStep,
    onClickPrevStep,
    onClickNextStep,
}) => {
    const previousButton = (
        <button className="btn" type="button" onClick={onClickPrevStep}>
            &laquo; Anterior
        </button>
    );

    const nextButton = (
        <button
            className={"btn " + (isValidStep ? "btn-primary" : "")}
            type="button"
            onClick={onClickNextStep}
            disabled={!isValidStep}
        >
            Siguiente &raquo;
        </button>
    );

    if (currentStep === 1) {
        return (
            <div className="d-flex flex-grow-1 justify-content-end">{nextButton}</div>
        );
    }
    if (currentStep === numberOfSteps) {
        return (
            <div className="d-flex flex-grow-1 justify-content-start">
                {previousButton}
            </div>
        );
    }

    return (
        <div className="d-flex flex-grow-1 justify-content-between">
            {previousButton}
            {nextButton}
        </div>
    );
};

export default WizardButtons;
