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
        const filterValue = Object.values(newFilter)[0];
        if (filterValue === "") {
            const updatedFilter = {...filter};
            delete updatedFilter[Object.keys(newFilter)[0]];
            setFilter(updatedFilter);
        } else {
            setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        }
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        setSelectedInvoicingMonth(selectedInvoicingMonth);
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
                    />
                ) : null
            }
        >
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListMonthlyInvoicesPage
                    invoices={filteredInvoices}
                    handleFilterChange={handleFilterChange}
                />
            )}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
