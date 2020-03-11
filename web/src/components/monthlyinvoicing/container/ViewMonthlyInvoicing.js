import React from "react";
import {MemberService} from "service/api";
import "components/common/SideBar.css";
import moment from "moment";
import {MonthlyInvoicingList} from "../presentation";
import {EditInvoice} from "components/invoice/container";
import {ViewMember} from "components/member/container";
import ViewMemberMonthInfoListSidebar from "./ViewMonthlyInvoicingSidebar";
import ViewInvoiceSidebar from "./ViewInvoiceSidebar";
import ViewMemberSidebar from "./ViewMemberSidebar";

class ViewMonthlyInvoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersMonthInfo: null,
            tablePageIndex: 0,
            filter: {
                month: moment().month(),
                year: moment().year(),
                nombre: "",
                sector: 0,
                tipo_socio: 0,
                estado: 0,
            },
            selectedInvoice: null,
            selectedMember: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleChangePageIndex = this.handleChangePageIndex.bind(this);
        this.handleSelectInvoice = this.handleSelectInvoice.bind(this);
        this.handleSelectMember = this.handleSelectMember.bind(this);
        this.handleBackFromInvoice = this.handleBackFromInvoice.bind(this);
        this.handleBackFromMember = this.handleBackFromMember.bind(this);
    }

    componentDidMount() {
        this.loadDataWithStateFilter();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.membersMonthInfo === null) {
            this.loadDataWithStateFilter();
        }
    }

    loadDataWithStateFilter() {
        MemberService.getMembersMonthInfo(this.state.filter).then(membersMonthInfo => {
            console.log("membersMonthInfo", membersMonthInfo);
            this.setState({membersMonthInfo: membersMonthInfo});
        });
    }

    handleFilterChange(newFilter) {
        this.setState(
            {filter: Object.assign(this.state.filter, newFilter), tablePageIndex: 0},
            () => {
                this.loadDataWithStateFilter();
            }
        );
    }

    handleChangePageIndex(tablePageIndex) {
        console.log("handleChangePageIndex", {tablePageIndex});
        this.setState({tablePageIndex});
    }

    handleSelectInvoice(numero) {
        console.log("handleSelectInvoice", numero);
        this.setState({
            selectedInvoice: numero,
        });
    }

    handleBackFromInvoice() {
        console.log("handleBackFromInvoice");
        this.setState({
            selectedInvoice: null,
        });
    }

    handleSelectMember(numero_socio) {
        console.log("handleSelectMember", numero_socio);
        this.setState({
            selectedMember: numero_socio,
        });
    }

    handleBackFromMember() {
        console.log("handleBackFromMember");
        this.setState({
            selectedMember: null,
        });
    }

    get sidebar() {
        if (this.state.selectedInvoice) {
            return (
                <ViewInvoiceSidebar
                    num_factura={this.state.selectedInvoice}
                    handleBack={this.handleBackFromInvoice}
                />
            );
        }
        if (this.state.selectedMember) {
            return <ViewMemberSidebar handleBack={this.handleBackFromMember} />;
        }
        return (
            <ViewMemberMonthInfoListSidebar
                filter={this.state.filter}
                membersMonthInfo={this.state.membersMonthInfo}
                handleFilterChange={this.handleFilterChange}
            />
        );
    }

    get content() {
        if (this.state.selectedInvoice) {
            return (
                <EditInvoice
                    num_factura={this.state.selectedInvoice}
                    handleBack={this.handleBackFromInvoice}
                />
            );
        }
        if (this.state.selectedMember) {
            return (
                <div className="col-md-12">
                    <ViewMember
                        num_socio={this.state.selectedMember}
                        handleBack={this.handleBackFromMember}
                    />
                </div>
            );
        }
        return (
            <MonthlyInvoicingList
                membersMonthInfo={this.state.membersMonthInfo}
                selectedPageIndex={this.state.tablePageIndex}
                handleChangePageIndex={this.handleChangePageIndex}
                handleSelectInvoice={this.handleSelectInvoice}
                handleSelectMember={this.handleSelectMember}
            />
        );
    }

    render() {
        return (
            <div className="h-100">
                <div className="row h-100">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        {this.sidebar}
                    </nav>
                    <div className="col-md-10 offset-md-2 con">
                        <div className="container">{this.content}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewMonthlyInvoicing;
