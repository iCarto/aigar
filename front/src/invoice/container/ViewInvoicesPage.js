import {useEffect} from "react";

import {useList} from "base/entity/provider";
import {useInvoicesList} from "invoice/provider";
import {useFilter} from "base/filter/hooks";

import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {ListInvoices} from ".";

const ViewInvoicesPage = () => {
    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const {invoices, filteredInvoices, setFilteredInvoices, isLoading} =
        useInvoicesList();

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
    }, [invoices, filter]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
    };

    return (
        <PageLayout>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListInvoices
                    invoices={filteredInvoices}
                    totalInvoices={invoices.length}
                    handleFilterChange={handleFilterChange}
                />
            )}
        </PageLayout>
    );
};

export default ViewInvoicesPage;
