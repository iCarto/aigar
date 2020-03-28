import React from "react";

class LoadDataWizardButtons extends React.Component {
    get previousButton() {
        return (
            <button
                className="btn"
                type="button"
                onClick={this.props.prev}
                disabled={!this.props.isPreviousButtonEnabled}
            >
                &laquo; Anterior
            </button>
        );
    }

    get nextButton() {
        return (
            <button
                className={
                    "btn " + (this.props.isNextButtonEnabled ? "btn-primary" : "")
                }
                type="button"
                onClick={this.props.next}
                disabled={!this.props.isNextButtonEnabled}
            >
                Siguiente &raquo;
            </button>
        );
    }

    render() {
        if (this.props.currentStep === 1) {
            return (
                <div className="d-flex flex-grow-1 justify-content-end">
                    {this.nextButton}
                </div>
            );
        }
        if (this.props.currentStep === this.props.numberOfSteps) {
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
}

export default LoadDataWizardButtons;
