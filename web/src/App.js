import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import NavBar from "./components/navbar/NavBar";

import {ListMonthlyInvoicing} from "components/monthlyinvoicing/container";
import {
    EditMember,
    CreateMember,
    ViewMember,
    ListMembers,
} from "./components/member/container";
import {ListInvoices, EditInvoice} from "components/invoice/container";

import ImportedDataWizard from "./components/common/importeddata/wizard/ImportedDataWizard";

import LoadPaymentsWizard from "./components/loadpayments/LoadPaymentsWizard";
import LoadMeasurementsWizard from "./components/loadmeasurements/LoadMeasurementsWizard";

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
            </BrowserRouter>
        );
    }

    componentDidMount() {
        Promise.resolve(DatabaseFixture).then(d => {
            this.setState({database: d});
        });
    }
}

function MainContent(props) {
    const {database} = props;
    return (
        <main role="main">
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
                        <ImportedDataWizard
                            {...props}
                            children={<LoadMeasurementsWizard />}
                            numberOfSteps={3}
                            currentStep={1}
                            database={database}
                        />
                    )}
                />
                <Route
                    path="/socios/:num_socio/modificar"
                    render={props => <EditMember {...props} database={database} />}
                />
                <Route
                    path="/socios/nuevo"
                    render={props => <CreateMember {...props} database={database} />}
                />
                <Route
                    path="/socios/:num_socio"
                    render={props => <ViewMember {...props} database={database} />}
                />
                <Route
                    path="/socios"
                    render={props => <ListMembers {...props} database={database} />}
                />
                <Route
                    path="/facturas/:num_factura/modificar"
                    render={props => <EditInvoice {...props} database={database} />}
                />
                <Route
                    path="/facturas"
                    render={props => <ListInvoices {...props} database={database} />}
                />
                <Route
                    exact
                    path="/"
                    render={props => (
                        <ListMonthlyInvoicing {...props} database={database} />
                    )}
                />
            </Switch>
        </main>
    );
}

export default App;
