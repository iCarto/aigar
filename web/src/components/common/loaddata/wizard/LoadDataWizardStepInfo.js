import React from "react";

class LoadDataWizardStepInfo extends React.Component {
    render() {
        const step = this.props.steps[this.props.currentStep - 1];
        if (step) {
            return (
                <div className="d-flex justify-content-between bg-secondary text-white p-3 rounded-top">
                    <div>
                        <i className={"fa fa-" + step.icon} />
                        &nbsp;
                        {step.text}
                    </div>
                    <div>
                        Paso {step.index} de {this.props.steps.length}
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default LoadDataWizardStepInfo;
