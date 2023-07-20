import {useState} from "react";
import WizardStepInfo from "./WizardStepInfo";
import WizardStepper from "./WizardStepper";
import WizardButtons from "./WizardButtons";
import WizardSidebar from "./WizardSidebar";

const Wizard = ({steps, isValidStep, onChangeStep, children}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep(prevStep =>
            prevStep >= steps?.length - 1 ? steps?.length : prevStep + 1
        );
        handleChangeStep();
    };

    const handlePrevStep = () => {
        setCurrentStep(prevStep => (prevStep <= 1 ? 1 : prevStep - 1));
        handleChangeStep();
    };

    const handleChangeStep = () => {
        onChangeStep(currentStep);
    };

    const stepper = steps ? (
        <WizardStepper
            steps={steps}
            currentStep={currentStep}
            isValidStep={isValidStep}
        />
    ) : null;

    const stepInfo = steps ? (
        <WizardStepInfo steps={steps} currentStep={currentStep} />
    ) : null;

    const buttons = (
        <WizardButtons
            currentStep={currentStep}
            numberOfSteps={steps?.length}
            isValidStep={isValidStep}
            onClickNextStep={handleNextStep}
            onClickPrevStep={handlePrevStep}
        />
    );

    const sidebar = <WizardSidebar />;

    const content = (
        <div className="d-flex flex-column justify-content-between">
            <div className="mb-4">{stepper}</div>
            <div className="rounded-top">{stepInfo}</div>
            <div className="border p-3">{children}</div>
            <div className="border-left border-right border-bottom rounded-bottom p-3">
                {buttons}
            </div>
        </div>
    );

    return (
        <>
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">{sidebar}</nav>
            <div className="col-md-10 offset-md-2">
                <div className="container">{content}</div>
            </div>
        </>
    );
};

export default Wizard;
