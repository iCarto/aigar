import {useList} from "base/entity/provider";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";

import {ListMonthlyInvoicesPage, ListMonthlyInvoicesSidebar} from ".";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {useEffect, useState} from "react";
import {useFilter} from "base/filter/hooks";

const ViewMonthlyInvoicingPage = () => {
    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const {
        invoices,
        areInvoicesLoading,
        selectedInvoicingMonth,
        invoicingMonthsForNavigator,
        setSelectedInvoicingMonth,
    } = useMonthlyInvoicingList();

    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(areInvoicesLoading);

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
        if (invoices) setLoading(false);
    }, [invoices, filter]);

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
        setLoading(true);
        setSelectedInvoicingMonth(selectedInvoicingMonth);
    };

    return (
        <PageLayout
            sidebar={
                selectedInvoicingMonth && filteredInvoices ? (
                    <ListMonthlyInvoicesSidebar
                        invoices={filteredInvoices}
                        invoicingMonths={invoicingMonthsForNavigator}
                        selectedInvoicingMonth={selectedInvoicingMonth}
                        handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                    />
                ) : null
            }
        >
            {areInvoicesLoading || loading ? (
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
