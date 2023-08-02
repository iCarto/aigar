import {useState} from "react";

import {PageLayout} from "../page";
import {WizardButtons, WizardSidebar, WizardStepInfo, WizardStepper} from ".";

const Wizard = ({steps, isValidStep, onChangeStep, children}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        const newStep =
            currentStep >= steps?.length - 1 ? steps?.length : currentStep + 1;
        setCurrentStep(newStep);
        onChangeStep(newStep);
    };

    const handlePrevStep = () => {
        const newStep = currentStep <= 1 ? 1 : currentStep - 1;
        setCurrentStep(newStep);
        onChangeStep(newStep);
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
        <div
            className="d-flex flex-column justify-content-between"
            style={{marginTop: "24px"}}
        >
            <div className="mb-4">{stepper}</div>
            <div className="rounded-top">{stepInfo}</div>
            <div className="border p-3">{children}</div>
            <div className="border-left border-right border-bottom rounded-bottom p-3">
                {buttons}
            </div>
        </div>
    );

    return <PageLayout sidebar={sidebar}>{content}</PageLayout>;
};

export default Wizard;
