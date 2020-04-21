import React from "react";
import "components/common/SideBar.css";
import ListMembers from "./ListMembers";
import ViewMember from "./ViewMember";
import CreateMember from "./CreateMember";

class ManageMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listView: {
                sortBy: [],
                pageIndex: 0,
            },
            filter: {
                name: "",
                sector: 0,
            },
            selectedMember: null,
            view: "list",
        };
        this.handleChangeListView = this.handleChangeListView.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleClickViewMember = this.handleClickViewMember.bind(this);
        this.handleBackViewMember = this.handleBackViewMember.bind(this);
        this.handleClickCreateMember = this.handleClickCreateMember.bind(this);
        this.handleSubmitCreateMember = this.handleSubmitCreateMember.bind(this);
        this.handleBackCreateMember = this.handleBackCreateMember.bind(this);
    }

    handleChangeListView(listView) {
        console.log("handleChangeListView", {listData: listView});
        this.setState({
            listView,
        });
    }

    handleFilterChange(newFilter) {
        console.log("handleFilterChange", newFilter);
        this.setState({
            filter: Object.assign(this.state.filter, newFilter),
            listView: Object.assign(this.state.listView, {pageIndex: 0}),
        });
    }

    handleClickViewMember(numero_socio) {
        console.log("handleSelectMember", numero_socio);
        this.setState({
            view: "view",
            selectedMember: numero_socio,
        });
    }

    handleBackViewMember() {
        console.log("handleBackViewMember");
        this.setState({
            view: "list",
            selectedMember: null,
        });
    }

    handleClickCreateMember() {
        console.log("handleSelectCreateMember");
        this.setState({
            view: "create",
        });
    }

    handleSubmitCreateMember(num_socio) {
        console.log("handleSubmitCreateMember", num_socio);
        this.setState({
            view: "view",
            selectedMember: num_socio,
        });
    }

    handleBackCreateMember() {
        console.log("handleBackCreateMember");
        this.setState({
            view: "list",
            selectedMember: null,
        });
    }

    render() {
        if (this.state.view === "view") {
            return (
                <ViewMember
                    num_socio={this.state.selectedMember}
                    handleBack={this.handleBackViewMember}
                />
            );
        }
        if (this.state.view === "create") {
            return (
                <CreateMember
                    handleSubmit={this.handleSubmitCreateMember}
                    handleBack={this.handleBackCreateMember}
                />
            );
        }
        return (
            <ListMembers
                listView={this.state.listView}
                handleChangeListView={this.handleChangeListView}
                handleFilterChange={this.handleFilterChange}
                handleClickViewMember={this.handleClickViewMember}
                handleClickCreateMember={this.handleClickCreateMember}
                filter={this.state.filter}
            />
        );
    }
}

export default ManageMembers;
