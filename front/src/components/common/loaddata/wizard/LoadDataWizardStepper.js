import React from "react";
import "./LoadDataWizardStepper.css";

class LoadDataWizardStepper extends React.Component {
    get steps() {
        return this.props.steps.map(step => {
            let stepClass = this.props.currentStep === step.index ? "active" : "";
            stepClass += " " + (this.props.isValidStep === true ? "valid" : "");
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
    }

    render() {
        return (
            <div className="col-12 stepper d-flex justify-content-center">
                {this.steps}
            </div>
        );
    }
}

export default LoadDataWizardStepper;
