import React from "react";
import {MemberService} from "service/api";
import "components/common/SideBar.css";
import moment from "moment";
import {EditInvoice} from "components/invoice/container";
import {ViewMember} from "components/member/container";
import ViewMemberMonthInfoListSidebar from "./ViewMemberMonthInfoListSidebar";
import {MonthlyInvoicingTable} from "../presentation";
import ViewInvoiceSidebar from "./ViewInvoiceSidebar";
import ViewMemberSidebar from "./ViewMemberSidebar";

class ViewMemberMonthInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersMonthInfo: null,
            selectedInvoice: null,
            selectedMember: null,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSelectInvoice = this.handleSelectInvoice.bind(this);
        this.handleSelectMember = this.handleSelectMember.bind(this);
        this.handleBackFromInvoice = this.handleBackFromInvoice.bind(this);
        this.handleBackFromMember = this.handleBackFromMember.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.membersMonthInfo === null) {
            this.loadData();
        }
    }

    loadData(filter = null) {
        if (!filter) {
            filter = {};
            filter.month = moment().month();
            filter.year = moment().year();
        }
        MemberService.getMembersMonthInfo(filter).then(membersMonthInfo => {
            console.log("membersMonthInfo", membersMonthInfo);
            this.setState({membersMonthInfo: membersMonthInfo});
        });
    }

    getOutputFilename() {
        return (
            "recibo_" +
            this.state.invoiceYear +
            "_" +
            this.state.invoiceMonth +
            "_todos"
        );
    }

    handleFilterChange(filter) {
        this.loadData(filter);
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
            <MonthlyInvoicingTable
                membersMonthInfo={this.state.membersMonthInfo}
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

export default ViewMemberMonthInfo;
