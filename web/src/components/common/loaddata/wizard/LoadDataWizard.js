import React from "react";
import LoadDataWizardStepInfo from "./LoadDataWizardStepInfo";
import LoadDataWizardStepper from "./LoadDataWizardStepper";
import LoadDataWizardButtons from "./LoadDataWizardButtons";

class LoadDataWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            currentStep: this.props.currentStep || 1,
            isPreviousButtonEnabled: true,
            isNextButtonEnabled: true,
        };
        this.setSteps = this.setSteps.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.setIsPreviousButtonEnabled = this.setIsPreviousButtonEnabled.bind(this);
        this.setIsNextButtonEnabled = this.setIsNextButtonEnabled.bind(this);
    }

    setSteps(steps) {
        this.setState({
            steps,
        });
    }

    next() {
        this.setState((prevState, props) => ({
            currentStep:
                prevState.currentStep >= prevState.steps.length - 1
                    ? prevState.steps.length
                    : prevState.currentStep + 1,
        }));
    }

    prev() {
        this.setState(prevState => ({
            currentStep: prevState.currentStep <= 1 ? 1 : prevState.currentStep - 1,
        }));
    }

    setIsPreviousButtonEnabled(isEnabled) {
        this.setState({isPreviousButtonEnabled: isEnabled});
    }

    setIsNextButtonEnabled(isEnabled) {
        this.setState({isNextButtonEnabled: isEnabled});
    }

    /* VIEW SUBCOMPONENTS */

    get stepper() {
        return (
            <LoadDataWizardStepper
                steps={this.state.steps}
                currentStep={this.state.currentStep}
            />
        );
    }

    get stepInfo() {
        return (
            <LoadDataWizardStepInfo
                steps={this.state.steps}
                currentStep={this.state.currentStep}
            />
        );
    }

    get buttons() {
        return (
            <LoadDataWizardButtons
                currentStep={this.state.currentStep}
                numberOfSteps={this.state.steps.length}
                isPreviousButtonEnabled={this.state.isPreviousButtonEnabled}
                isNextButtonEnabled={this.state.isNextButtonEnabled}
                next={this.next}
                prev={this.prev}
            />
        );
    }

    render() {
        return (
            <div className="container">
                <div className="d-flex flex-column justify-content-between">
                    <div className="mb-4">{this.stepper}</div>
                    <div className="rounded-top">{this.stepInfo}</div>
                    <div className="border p-3">
                        {React.cloneElement(this.props.children, {
                            ...this.props,
                            setSteps: this.setSteps,
                            currentStep: this.state.currentStep,
                            setIsPreviousButtonEnabled: this.setIsPreviousButtonEnabled,
                            setIsNextButtonEnabled: this.setIsNextButtonEnabled,
                        })}
                    </div>
                    <div className="border-left border-right border-bottom rounded-bottom p-3">
                        {this.buttons}
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadDataWizard;
