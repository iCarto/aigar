import React from "react";
import {InvoiceService} from "service/api";
import {Spinner} from "components/common";
import {InvoicesList} from "components/invoice/presentation";

class ListMemberInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            num_socio: null,
        };
    }

    static getDerivedStateFromProps(props, prevState) {
        const num_socio = props.num_socio;
        if (num_socio !== prevState.num_socio) {
            return {
                invoices: null,
                num_socio,
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
        InvoiceService.getInvoicesForMember(this.props.num_socio).then(invoices => {
            console.log("invoices", invoices);
            this.setState({invoices});
        });
    }

    render() {
        console.log("ListMemberInvoices.render");
        if (this.state.invoices) {
            return (
                <InvoicesList
                    invoices={this.state.invoices}
                    showLink={false}
                    showMember={false}
                />
            );
        }
        return <Spinner message="Cargando datos" />;
    }
}

export default ListMemberInvoices;
