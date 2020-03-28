import React from "react";

class ImportedDataWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: this.props.currentStep,
            isNextButtonEnabled: false,
        };
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.setIsNextButtonEnabled = this.setIsNextButtonEnabled.bind(this);
    }

    next() {
        this.setState((prevState, props) => ({
            currentStep:
                prevState.currentStep >= props.numberOfSteps - 1
                    ? props.numberOfSteps
                    : prevState.currentStep + 1,
        }));
    }

    prev() {
        this.setState(prevState => ({
            currentStep: prevState.currentStep <= 1 ? 1 : prevState.currentStep - 1,
        }));
    }

    setIsNextButtonEnabled(isEnabled) {
        this.setState({isNextButtonEnabled: isEnabled});
    }

    get previousButton() {
        return (
            <button className="btn" type="button" onClick={this.prev}>
                &laquo; Anterior
            </button>
        );
    }

    get nextButton() {
        return (
            <button
                className={
                    "btn " + (this.state.isNextButtonEnabled ? "btn-primary" : "")
                }
                type="button"
                onClick={this.next}
                disabled={!this.state.isNextButtonEnabled}
            >
                Siguiente &raquo;
            </button>
        );
    }

    get buttons() {
        console.log(this.state.currentStep, this.props.numberOfSteps);
        if (this.state.currentStep === 1) {
            return (
                <div className="d-flex flex-grow-1 justify-content-end">
                    {this.nextButton}
                </div>
            );
        }
        if (this.state.currentStep === this.props.numberOfSteps) {
            return (
                <div className="d-flex flex-grow-1 justify-content-start">
                    {this.previousButton}
                </div>
            );
        }
        return (
            <div className="d-flex flex-grow-1 justify-content-between">
                {this.previousButton}
                {this.nextButton}
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                {React.cloneElement(this.props.children, {
                    ...this.props,
                    currentStep: this.state.currentStep,
                    next: this.next,
                    prev: this.prev,
                    buttons: this.buttons,
                    setIsNextButtonEnabled: this.setIsNextButtonEnabled,
                })}
            </div>
        );
    }
}

export default ImportedDataWizard;
