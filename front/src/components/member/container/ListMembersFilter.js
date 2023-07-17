import React from "react";
import {DomainService} from "service/api";
import {MembersFilter} from "../presentation";

class ListMembersFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {
                sectors: [],
                memberTypes: [],
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.loadDomains();
    }

    loadDomains() {
        console.log("loadDomains");
        Promise.all([DomainService.getSectors(), DomainService.getMemberTypes()]).then(
            results => {
                this.setState({
                    domain: {
                        sectors: results[0],
                        memberTypes: results[1],
                    },
                });
            }
        );
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.props.handleFilterChange({[name]: value});
    }

    render() {
        return (
            <MembersFilter
                sectorsDomain={this.state.domain.sectors}
                memberTypesDomain={this.state.domain.memberTypes}
                filter={this.props.filter}
                handleChange={this.props.handleFilterChange}
            />
        );
    }
}

export default ListMembersFilter;
