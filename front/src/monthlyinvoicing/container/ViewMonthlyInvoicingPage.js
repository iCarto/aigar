import {useEffect, useState} from "react";

import ListMonthlyInvoices from "./ListMonthlyInvoices";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import "base/ui/mainpage/SideBar.css";

const ViewMonthlyInvoicingPage = () => {
    const [invoices, setInvoices] = useState(null);
    const [invoicingMonths, setInvoicingMonths] = useState(null);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);
    const [listView, setListView] = useState({
        sortBy: [],
        pageIndex: 0,
    });
    const [filter, setFilter] = useState({
        nombre: "",
        sector: 0,
        tipo_socio: 0,
        estado: 0,
    });

    useEffect(() => {
        let invoicingMonthOpened;
        InvoicingMonthService.getInvoicingMonths()
            .then(invoicingMonths => {
                invoicingMonthOpened = invoicingMonths.find(
                    invoicingMonth => invoicingMonth.is_open
                );
                // Next month add to allow the creation of a new monthly invoicing process
                setInvoicingMonths([
                    ...invoicingMonths,
                    InvoicingMonthService.getNextInvoicingMonthToCreate(
                        invoicingMonthOpened
                    ),
                ]);
                setSelectedInvoicingMonth(invoicingMonthOpened);
            })
            .then(() =>
                InvoicingMonthService.getInvoicingMonthInvoices(
                    invoicingMonthOpened.id_mes_facturacion
                )
                    .then(invoices => {
                        setInvoices(invoices);
                    })
                    .catch(error => {
                        console.log(error);
                        setInvoices([]);
                    })
            );
    }, []);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
        setListView(prevListView => ({
            ...prevListView,
            pageIndex: 0,
        }));
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        console.log("handleChangeInvoicingMonth");
        setSelectedInvoicingMonth(selectedInvoicingMonth);
    };

    const handleSuccessCreateInvoices = () => {
        console.log("handleSuccessCreateInvoices");
        // loadInvoicingMonths();
    };

    const handleSuccessCreateNewInvoiceVersion = (
        new_version_id_factura,
        old_version_id_factura
    ) => {
        // Replace old version id
        const filteredInvoicesIdsNew = filteredInvoicesIds.map(invoiceId =>
            invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
        );
        setFilteredInvoicesIds(filteredInvoicesIdsNew);
    };

    return (
        <>
            {selectedInvoicingMonth && invoices ? (
                <ListMonthlyInvoices
                    listView={listView}
                    handleFilterChange={handleFilterChange}
                    // handleChangeListView={handleChangeListView}
                    filter={filter}
                    invoicingMonths={invoicingMonths}
                    invoices={invoices}
                    selectedInvoicingMonth={selectedInvoicingMonth}
                    handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                    handleSuccessCreateInvoices={handleSuccessCreateInvoices}
                />
            ) : null}
        </>
    );
};

export default ViewMonthlyInvoicingPage;
