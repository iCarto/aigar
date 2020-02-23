import React from "react";

class Members extends React.Component {
    constructor(props) {
        super(props);
        const {invoices} = props;
        console.log(invoices);
    }

    render() {
        return (
            <div>
                <h1>Socios</h1>
            </div>
        );
    }
}

export default Members;
