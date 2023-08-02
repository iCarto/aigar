import {useEffect} from "react";

import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";

import {ListMonthlyInvoicesPage, ListMonthlyInvoicesSidebar} from ".";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";

const ViewMonthlyInvoicingPage = () => {
    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const {
        invoices,
        filteredInvoices,
        setFilteredInvoices,
        invoicingMonths,
        selectedInvoicingMonth,
        setSelectedInvoicingMonth,
        isLoading,
    } = useMonthlyInvoicingList();

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
    }, [selectedInvoicingMonth, invoices, filter]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        console.log("handleChangeInvoicingMonth", selectedInvoicingMonth);
        setSelectedInvoicingMonth(selectedInvoicingMonth);
    };

    // const handleSuccessCreateNewInvoiceVersion = (
    //     new_version_id_factura,
    //     old_version_id_factura
    // ) => {
    //     // Replace old version id
    //     const filteredInvoicesIdsNew = filteredInvoicesIds.map(invoiceId =>
    //         invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
    //     );
    //     setFilteredInvoicesIds(filteredInvoicesIdsNew);
    // };

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
                    invoices={filteredInvoices}
                    totalInvoices={invoices.length}
                    invoicingMonths={invoicingMonths}
                    selectedInvoicingMonth={selectedInvoicingMonth}
                    handleFilterChange={handleFilterChange}
                    handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                />
            )}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
