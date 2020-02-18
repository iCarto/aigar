import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import NavBar from "./components/navbar/NavBar";
import LoadMeasurements from "./components/loadmeasurements/LoadMeasurements";
import Members from "./components/members/Members";
import Invoicing from "./components/invoicing/Invoicing";
import ImportedDataWizard from "./components/common/importeddata/wizard/ImportedDataWizard";
import LoadPaymentsWizard from "./components/loadpayments/LoadPaymentsWizard";

import DatabaseFixture from "./fixtures/database.json";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {database: {}};
    }

    render() {
        const {database} = this.state;
        return (
            <BrowserRouter>
                <NavBar />
                <MainContent database={database} />
                <footer></footer>
            </BrowserRouter>
        );
    }

    componentDidMount() {
        Promise.resolve(DatabaseFixture).then(d => {
            this.setState({database: d});
            console.log(d);
        });
    }
}

function MainContent(props) {
    const {database} = props;
    return (
        <main role="main" className="container">
            <Switch>
                <Route
                    path="/cargarpagos"
                    render={props => (
                        <ImportedDataWizard
                            {...props}
                            children={<LoadPaymentsWizard />}
                            numberOfSteps={3}
                            currentStep={1}
                            database={database}
                        />
                    )}
                />
                <Route
                    path="/cargarlecturas"
                    render={props => (
                        <LoadMeasurements {...props} database={database} />
                    )}
                />
                <Route
                    path="/socios"
                    render={props => <Members {...props} database={database} />}
                />
                <Route
                    path="/facturacion"
                    render={props => <Invoicing {...props} database={database} />}
                />
                <Route
                    exact
                    path="/"
                    render={props => <Invoicing {...props} database={database} />}
                />
            </Switch>
        </main>
    );
}

export default App;
