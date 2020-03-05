import React from "react";
import {InvoicesTable} from "components/invoice/presentation";
import {InvoiceService} from "service/api";

class ListMemberInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            prevNumSocio: null,
        };
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio;
        if (num_socio !== prevState.prevNumSocio) {
            return {
                invoices: null,
                prevNumSocio: num_socio,
            };
        }
        return null;
    }

    componentDidMount() {
        this.loadInvoicesForMember();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.invoices === null) {
            this.loadInvoicesForMember();
        }
    }

    loadInvoicesForMember() {
        InvoiceService.getInvoices({num_socio: this.props.num_socio}).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    render() {
        return <InvoicesTable invoices={this.state.invoices} />;
    }
}

export default ListMemberInvoices;
