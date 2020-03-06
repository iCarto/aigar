import React from "react";
import {Spinner} from "components/common";
import {MemberService, DomainService} from "service/api";
import InvoiceButton from "components/common/invoicing/InvoicePrintButton";
import {
    MonthlyInvoicingTable,
    MonthlyInvoicingFilter,
    MonthlyInvoicingCalendar,
} from "../presentation";
import "components/common/SideBar.css";
import moment from "moment";
import {EditInvoice} from "components/invoice/container";
import {EditMember, ViewMember} from "components/member/container";

class ListMonthlyInvoicing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersMonthInfo: null,
            selectedInvoice: null,
            selectedMember: null,
            filter: {
                month: moment().month(),
                year: moment().year(),
            },
            domains: {
                memberTypes: [],
            },
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSelectInvoice = this.handleSelectInvoice.bind(this);
        this.handleSelectMember = this.handleSelectMember.bind(this);
        this.handleBackFromInvoice = this.handleBackFromInvoice.bind(this);
        this.handleBackFromMember = this.handleBackFromMember.bind(this);
    }

    componentDidMount() {
        this.loadData();
        this.loadDomains();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.invoices === null) {
            this.loadData();
        }
    }

    loadData() {
        MemberService.getMembersMonthInfo(this.state.filter).then(membersMonthInfo => {
            console.log("membersMonthInfo", membersMonthInfo);
            this.setState({membersMonthInfo: membersMonthInfo});
        });
    }

    loadDomains() {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getInvoiceStatus(),
        ]).then(results => {
            this.setState({
                domains: {
                    ...this.state.domains,
                    sectors: results[0],
                    memberTypes: results[1],
                    invoiceStatus: results[2],
                },
            });
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

    handleDateChange(year, month) {
        console.log("handleDateChange", {year}, {month});
        this.setState(
            {
                filter: {
                    month,
                    year,
                },
            },
            () => {
                this.loadData();
            }
        );
    }

    handleFilterChange(name, value) {
        console.log("handleFilterChange", {name}, {value});
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    [name]: value,
                },
            },
            () => {
                this.loadData();
            }
        );
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

    render() {
        if (this.state.membersMonthInfo) {
            if (this.state.selectedInvoice) {
                return (
                    <div className="col-md-12">
                        <EditInvoice
                            num_factura={this.state.selectedInvoice}
                            handleBack={this.handleBackFromInvoice}
                        />
                    </div>
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
                <div className="h-100">
                    <div className="row h-100">
                        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky p-3 d-flex flex-column justify-content-between">
                                <MonthlyInvoicingFilter
                                    sectorsDomain={this.state.domains.sectors}
                                    memberTypesDomain={this.state.domains.memberTypes}
                                    invoiceStatusDomain={
                                        this.state.domains.invoiceStatus
                                    }
                                    handleChange={this.handleFilterChange}
                                />
                                <InvoiceButton
                                    invoices={this.state.invoices}
                                    buttonTitle="Imprimir facturas"
                                    outputFilename={this.getOutputFilename()}
                                />
                            </div>
                        </nav>
                        <div className="col-md-10 offset-md-2">
                            <MonthlyInvoicingCalendar
                                month={this.state.filter.month}
                                year={this.state.filter.year}
                                handleChange={this.handleDateChange}
                            />
                            <MonthlyInvoicingTable
                                membersMonthInfo={this.state.membersMonthInfo}
                                handleSelectInvoice={this.handleSelectInvoice}
                                handleSelectMember={this.handleSelectMember}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <Spinner message="Cargando datos" />;
        }
    }
}

export default ListMonthlyInvoicing;
