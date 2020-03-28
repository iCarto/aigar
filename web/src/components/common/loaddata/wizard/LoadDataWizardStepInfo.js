import React from "react";

class LoadDataWizardStepInfo extends React.Component {
    render() {
        return (
            <div className="d-flex justify-content-between bg-secondary text-white p-3 rounded-top">
                <div>
                    <i className={"fa fa-" + this.props.step.icon} />
                    &nbsp;
                    {this.props.step.text}
                </div>
                <div>
                    Paso {this.props.step.index} de {this.props.numberOfSteps}
                </div>
            </div>
        );
    }
}

export default LoadDataWizardStepInfo;
