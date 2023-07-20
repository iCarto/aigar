const WizardStepInfo = ({steps, currentStep}) => {
    const step = steps[currentStep - 1];

    if (step) {
        return (
            <div className="d-flex justify-content-between bg-secondary text-white p-3 rounded-top">
                <div>
                    <i className={"fa fa-" + step.icon} />
                    &nbsp;
                    {step.text}
                </div>
                <div>
                    Paso {step.index} de {steps.length}
                </div>
            </div>
        );
    }

    return null;
};

export default WizardStepInfo;
