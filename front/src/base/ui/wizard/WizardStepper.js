import Grid from "@mui/material/Grid";
import "./WizardStepper.css";

const WizardStepper = ({steps, currentStep, isValidStep}) => {
    const stepsElements = steps.map(step => {
        let stepClass = currentStep === step.index ? "active" : "";
        stepClass += " " + (isValidStep === true ? "valid" : "");
        return (
            <div className={"step " + stepClass} key={step.index}>
                <i className={"circle fa fa-" + step.icon} />
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
