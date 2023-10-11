import {useEffect, useState} from "react";
import {useList} from "base/entity/provider";
import {useMonthlyInvoicingList} from "monthlyinvoicing/provider";
import {useFilter} from "base/filter/hooks";

import {ListMonthlyInvoicesPage, ListMonthlyInvoicesSidebar} from ".";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";

const ViewMonthlyInvoicingPage = () => {
    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const {
        invoices,
        areInvoicesLoading,
        selectedInvoicingMonth,
        invoicingMonthsForNavigator,
        setSelectedInvoicingMonth,
        isDataUpdated,
        setIsDataUpdated,
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

    const refreshTable = () => {
        setIsDataUpdated(prevState => !prevState);
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
                    key={isDataUpdated}
                    invoices={filteredInvoices}
                    handleFilterChange={handleFilterChange}
                    refreshTable={refreshTable}
                />
            )}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
