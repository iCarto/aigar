import React from "react";

class LoadPaymentsStepper extends React.Component {
    stepper = [
        {
            index: 1,
            text: "Cargar archivo",
        },
        {
            index: 2,
            text: "Revisar entradas",
        },
        {
            index: 3,
            text: "Resultado",
        },
    ];

    get steps() {
        return this.stepper.map(step => {
            let activeClass = this.props.currentStep === step.index ? "active" : "";
            return (
                <li className="col-4 nav-item text-center" key={step.index}>
                    <a href="#step" className={"nav-link " + activeClass}>
                        <h4>Paso {step.index}</h4>
                        <p>{step.text}</p>
                    </a>
                </li>
            );
        });
    }

    render() {
        return (
            <div className="col-12 row form-group">
                <ul className="col-12 nav nav-pills row justify-content-between border rounded">
                    {this.steps}
                </ul>
            </div>
        );
    }
}

export default LoadPaymentsStepper;
