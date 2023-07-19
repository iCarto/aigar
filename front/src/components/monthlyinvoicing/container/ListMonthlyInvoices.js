import React, {useState, useEffect} from "react";
import {Spinner} from "components/common";
import {InvoicingMonthService} from "service/api";
import "components/common/SideBar.css";
import ListMonthlyInvoicesSidebar from "./ListMonthlyInvoicesSidebar";
import {EntityList} from "base/entity/components/presentational";
import {useMonthlyInvoicingTableColumns} from "../data";

const ListMonthlyInvoices = ({
    invoices,
    listView,
    handleChangeListView,
    handleFilterChange,
    invoicingMonths,
    selectedInvoicingMonth,
    handleChangeInvoicingMonth,
    handleSuccessCreateInvoices,
    filter,
}) => {
    const [filteredInvoices, setFilderedInvoices] = useState(null);
    const {tableColumns} = useMonthlyInvoicingTableColumns();

    useEffect(() => {
        // console.log("ListMonthlyInvoices.componentDidUpdate");
        // if (
        //     props.selectedInvoicingMonth.id_mes_facturacion !==
        //     prevSelectedInvoicingMonth.id_mes_facturacion
        // ) {
        //     loadInvoices();
        // }
        setFilderedInvoices(filterInvoices(invoices, filter));
    }, [selectedInvoicingMonth]);

    // const loadInvoices = () => {
    //     setInvoices(null);
    //     InvoicingMonthService.getInvoicingMonthInvoices(
    //         props.selectedInvoicingMonth.id_mes_facturacion
    //     )
    //         .then(invoices => {
    //             console.log("invoices", invoices);
    //             setInvoices(invoices);
    //         })
    //         .catch(error => {
    //             setInvoices([]);
    //         });
    // };

    const handleSuccessPrintInvoices = () => {
        // loadInvoices();
    };

    const handleClickViewInvoice = id_factura => {
        const filteredInvoices = filter(invoices, filter);
        const filteredInvoicesIds = filteredInvoices.map(invoice => invoice.id_factura);
        handleClickViewInvoice(id_factura, filteredInvoicesIds);
    };

    const filterInvoices = (invoices, filter) => {
        if (invoices) {
            return invoices.filter(invoice => {
                var filtered = true;
                if (filter) {
                    if (filter.nombre) {
                        filtered =
                            filtered &&
                            invoice.nombre
                                .toLowerCase()
                                .indexOf(filter.nombre.toLowerCase()) >= 0;
                    }
                    if (filter.sector) {
                        filtered =
                            filtered && invoice.sector === parseInt(filter.sector);
                    }
                    if (filter.tipo_socio) {
                        filtered = filtered && invoice.tipo_socio === filter.tipo_socio;
                    }
                    if (filter.estado) {
                        filtered = filtered && invoice.estado === filter.estado;
                    }
                }
                return filtered;
            });
        }
        return null;
    };

    return (
        <div className="h-100">
            <div className="row no-gutters h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <ListMonthlyInvoicesSidebar
                        filter={filter}
                        invoices={filteredInvoices}
                        invoicingMonths={invoicingMonths}
                        selectedInvoicingMonth={selectedInvoicingMonth}
                        handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                        handleSuccessCreateInvoices={handleSuccessCreateInvoices}
                        handleFilterChange={handleFilterChange}
                        handleSuccessPrintInvoices={handleSuccessPrintInvoices}
                    />
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">
                        <EntityList
                            items={filteredInvoices}
                            columns={tableColumns}
                            listView={listView}
                            handleChangeListView={handleChangeListView}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListMonthlyInvoices;
