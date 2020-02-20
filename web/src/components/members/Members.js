import React from "react";

class Members extends React.Component {
    constructor(props) {
        super(props);
        const {invoices} = props;
        console.log(invoices);
    }

    render() {
        return <h1>Socios</h1>;
    }
}

export default Members;
