import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import NavBar from "./components/navbar/NavBar";

import {ViewMonthlyInvoicing} from "components/monthlyinvoicing/container";
import {
    EditMember,
    CreateMember,
    ViewMember,
    ManageMembers,
} from "./components/member/container";
import {EditInvoice, ManageInvoices} from "components/invoice/container";

import LoadDataWizard from "./components/common/loaddata/wizard/LoadDataWizard";

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
                        <LoadDataWizard
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
                        <LoadDataWizard {...props} numberOfSteps={3}>
                            <LoadMeasurementsWizard />
                        </LoadDataWizard>
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
                <Route path="/socios" render={props => <ManageMembers {...props} />} />
                <Route
                    path="/facturas/:id_factura/modificar"
                    render={props => <EditInvoice {...props} database={database} />}
                />
                <Route
                    path="/facturas"
                    render={props => <ManageInvoices {...props} />}
                />
                <Route
                    exact
                    path="/"
                    render={props => (
                        <ViewMonthlyInvoicing {...props} database={database} />
                    )}
                />
            </Switch>
        </main>
    );
}

export default App;
