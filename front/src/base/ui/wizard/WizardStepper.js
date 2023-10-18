import {cloneElement} from "react";
import Grid from "@mui/material/Grid";
import "./WizardStepper.css";

const WizardStepper = ({steps, currentStep, isValidStep}) => {
    const stepsElements = steps.map(step => {
        const isStepActive = currentStep === step.index;
        const isValidatedStep = step.index < currentStep;

        const getStepColor = () => {
            if ((isStepActive && isValidStep) || isValidatedStep) return "green";
            if (isStepActive) return "#007bff";
            return "lightgrey";
        };

        let stepClass = isStepActive ? "active" : "";
        stepClass += " " + (isValidStep ? "valid" : "");

        return (
            <div className={"step " + stepClass} key={step.index}>
                {cloneElement(step.icon, {
                    sx: {
                        borderRadius: "2em",
                        padding: 2,
                        backgroundColor: getStepColor(),
                        color: "white",
                        fontSize: "4em",
                    },
                })}
                <div className="title">
                    {step.index}. {step.text}
                </div>
                <div className="help">{step.help}</div>
            </div>
        );
    });

    return (
        <Grid container justifyContent="center" className="stepper">
            {stepsElements}
        </Grid>
    );
};

export default WizardStepper;
