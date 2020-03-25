import React from "react";
import {DomainService} from "service/api";
import {MonthlyInvoicingFilter} from "../presentation";

class ListMonthlyInvoicesFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
                memberTypes: [],
                invoiceStatus: [],
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getInvoiceStatus(),
        ]).then(results => {
            this.setState({
                domain: {
                    sectors: results[0],
                    memberTypes: results[1],
                    invoiceStatus: results[2],
                },
            });
        });
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.props.handleFilterChange({[name]: value});
    }

    render() {
        return (
            <MonthlyInvoicingFilter
                sectorsDomain={this.state.domain.sectors}
                memberTypesDomain={this.state.domain.memberTypes}
                invoiceStatusDomain={this.state.domain.invoiceStatus}
                filter={this.props.filter}
                handleChange={this.handleFilterChange}
            />
        );
    }
}

export default ListMonthlyInvoicesFilter;
