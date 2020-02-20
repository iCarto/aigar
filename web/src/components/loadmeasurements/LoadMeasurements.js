import React from "react";

import DatabaseFixture from "fixtures/database.json";

class LoadMeasurements extends React.Component {
    constructor(props) {
        super(props);
        const {invoices, members, domains} = DatabaseFixture;
        console.table(invoices);
        console.table(members);
        console.log(domains);
    }

    render() {
        return <h1>Cargar Lecturas:</h1>;
    }
}

export default LoadMeasurements;
