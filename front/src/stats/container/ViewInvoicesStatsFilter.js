import React from "react";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {InvoicesStatsFilter} from "stats/presentational";
import {DomainService} from "aigar/domain/service";

class ViewInvoicesStatsFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoicingMonths: [],
            domain: {
                sectors: [],
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        Promise.all([
            DomainService.getSectors(),
            InvoicingMonthService.getInvoicingMonths(),
        ]).then(results => {
            const invoicingMonths = results[1];
            invoicingMonths.sort((a, b) => {
                if (a.id_mes_facturacion < b.id_mes_facturacion) {
                    return 1;
                }
                if (a.id_mes_facturacion > b.id_mes_facturacion) {
                    return -1;
                }
                return 0;
            });
            this.setState({
                domain: {
                    sectors: results[0],
                },
                invoicingMonths,
            });
        });
    }

    handleFilterChange(name, value) {
        this.props.handleFilterChange({[name]: value});
    }

    render() {
        return (
            <InvoicesStatsFilter
                sectorsDomain={this.state.domain.sectors}
                invoicingMonths={this.state.invoicingMonths}
                filter={this.props.filter}
                handleChange={this.handleFilterChange}
            />
        );
    }
}

export default ViewInvoicesStatsFilter;
