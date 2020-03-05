import React from "react";
import LoadPaymentsStepper from "./LoadPaymentsStepper";
import LoadPaymentsStep1ReadFile from "./LoadPaymentsStep1ReadFile";
import LoadPaymentsStep2PaymentsTable from "./LoadPaymentsStep2PaymentsTable";
import LoadPaymentsStep3Results from "./LoadPaymentsStep3Results";
import {PaymentService} from "service/file";

/*
Higher order component that:
- wraps all the other components
- implements flow navigation between child components
- use service to manage data
*/
class LoadPaymentsWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
        };
        this.handleCSVFileLoaded = this.handleCSVFileLoaded.bind(this);
    }

    handleCSVFileLoaded(csvFileLoaded) {
        this.setState({
            payments: PaymentService.getPaymentsFromCSVContent(csvFileLoaded.content),
        });
    }

    handlePaymentsValidated(verifiedPayments) {
        this.setState({
            payments: verifiedPayments,
        });
        // Call to service to store data
        // paymentsService.store(verifiedPayments);
    }

    /* VIEW SUBCOMPONENTS */

    get paymentsStepper() {
        return <LoadPaymentsStepper currentStep={this.props.currentStep} />;
    }

    get currentStepComponent() {
        switch (this.props.currentStep) {
            case 1:
                return (
                    <LoadPaymentsStep1ReadFile
                        next={this.props.next}
                        afterValid={this.handleCSVFileLoaded}
                    />
                );
            case 2:
                return (
                    <LoadPaymentsStep2PaymentsTable
                        prev={this.props.prev}
                        next={this.props.next}
                        afterValid={this.handlePaymentsValidated}
                        payments={this.state.payments}
                    />
                );
            case 3:
                return (
                    <LoadPaymentsStep3Results
                        prev={this.props.prev}
                        payments={this.state.payments}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="row col-md-8 offset-md-2">
                {this.paymentsStepper}
                {this.currentStepComponent}
                {this.previousButton}
                {this.nextButton}
            </div>
        );
    }
}

export default LoadPaymentsWizard;
