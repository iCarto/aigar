import {useEffect, useState} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";

import {PageLayout} from "base/ui/page";
import {ListMonthlyInvoicesPage, ListMonthlyInvoicesSidebar} from ".";
import {Spinner} from "base/common";
import InvoiceStatusIcon from "invoice/presentational/InvoiceStatusIcon";

const ViewMonthlyInvoicingPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState(null);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);
    const [filteredInvoices, setFilderedInvoices] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();

    console.log(invoices);

    useEffect(() => {
        setIsLoading(true);
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
            )
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        setFilderedInvoices(filterFunction(invoices));
    }, [selectedInvoicingMonth, invoices, filter]);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
        // setListView(prevListView => ({
        //     ...prevListView,
        //     pageIndex: 0,
        // }));
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        console.log("handleChangeInvoicingMonth");
        setSelectedInvoicingMonth(selectedInvoicingMonth);
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
        <PageLayout
            sidebar={
                selectedInvoicingMonth && invoices ? (
                    <ListMonthlyInvoicesSidebar
                        invoices={filteredInvoices}
                        invoicingMonths={invoicingMonths}
                        selectedInvoicingMonth={selectedInvoicingMonth}
                        handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                        handleFilterChange={undefined}
                    />
                ) : null
            }
        >
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListMonthlyInvoicesPage
                    handleFilterChange={handleFilterChange}
                    invoicingMonths={invoicingMonths}
                    invoices={filteredInvoices}
                    selectedInvoicingMonth={selectedInvoicingMonth}
                    handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                />
            )}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
