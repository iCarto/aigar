import React from "react";
import {DomainService} from "service/api";
import {InvoicesFilter} from "../presentation";

class ListInvoicesFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        console.log("loadDomains");
        Promise.all([DomainService.getSectors()]).then(results => {
            this.setState({
                domain: {
                    sectors: results[0],
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
            <InvoicesFilter
                sectorsDomain={this.state.domain.sectors}
                filter={this.props.filter}
                handleChange={this.props.handleFilterChange}
            />
        );
    }
}

export default ListInvoicesFilter;
