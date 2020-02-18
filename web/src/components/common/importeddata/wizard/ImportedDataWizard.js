import React from "react";

class ImportedDataWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: this.props.currentStep,
        };
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
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

    render() {
        return (
            <div>
                {React.cloneElement(this.props.children, {
                    currentStep: this.state.currentStep,
                    next: this.next,
                    prev: this.prev,
                })}
            </div>
        );
    }
}

export default ImportedDataWizard;
