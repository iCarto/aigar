import React from "react";
import "./ImportedDataWizardStepper.css";

class ImportedDataWizardStepper extends React.Component {
    get steps() {
        return this.props.steps.map(step => {
            let activeClass = this.props.currentStep === step.index ? "active" : "";
            return (
                <div className={"step " + activeClass} key={step.index}>
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

export default ImportedDataWizardStepper;
