import React from "react";
import LoadDataWizardStepInfo from "./LoadDataWizardStepInfo";
import LoadDataWizardStepper from "./LoadDataWizardStepper";
import LoadDataWizardButtons from "./LoadDataWizardButtons";
import LoadDataWizardSidebar from "./LoadDataWizardSidebar";

class LoadDataWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            currentStep: this.props.currentStep || 1,
            isValidStep: false,
        };
        this.setSteps = this.setSteps.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.setIsValidStep = this.setIsValidStep.bind(this);
        this.handleBack = this.handleBack.bind(this);
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
            isNextButtonEnabled: false,
        }));
    }

    prev() {
        this.setState(prevState => ({
            currentStep: prevState.currentStep <= 1 ? 1 : prevState.currentStep - 1,
            isNextButtonEnabled: false,
        }));
    }

    setIsValidStep(valid) {
        this.setState({isValidStep: valid});
    }

    handleBack() {
        this.props.history.push("/");
    }

    /* VIEW SUBCOMPONENTS */

    get stepper() {
        return (
            <LoadDataWizardStepper
                steps={this.state.steps}
                currentStep={this.state.currentStep}
                isValidStep={this.state.isValidStep}
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
                isValidStep={this.state.isValidStep}
                next={this.next}
                prev={this.prev}
            />
        );
    }

    get sidebar() {
        return <LoadDataWizardSidebar handleBack={this.handleBack} />;
    }

    get content() {
        return (
            <div className="d-flex flex-column justify-content-between">
                <div className="mb-4">{this.stepper}</div>
                <div className="rounded-top">{this.stepInfo}</div>
                <div className="border p-3">
                    {React.cloneElement(this.props.children, {
                        ...this.props,
                        setSteps: this.setSteps,
                        currentStep: this.state.currentStep,
                        setIsValidStep: this.setIsValidStep,
                    })}
                </div>
                <div className="border-left border-right border-bottom rounded-bottom p-3">
                    {this.buttons}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="h-100">
                <div className="row no-gutters h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2">
                        <div className="container">{this.content}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadDataWizard;
