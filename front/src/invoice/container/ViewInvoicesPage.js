import {useEffect} from "react";

import {useList} from "base/entity/provider";
import {useInvoicesList} from "invoice/provider";
import {useFilter} from "base/filter/hooks";

import {PageLayout} from "base/ui/page";
import {Spinner} from "base/ui/other/components";
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
        const filterValue = Object.values(newFilter)[0];
        if (filterValue === "") {
            const updatedFilter = {...filter};
            delete updatedFilter[Object.keys(newFilter)[0]];
            setFilter(updatedFilter);
        } else {
            setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        }
    };

    return (
        <PageLayout>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListInvoices
                    invoices={filteredInvoices}
                    handleFilterChange={handleFilterChange}
                />
            )}
        </PageLayout>
    );
};

export default ViewInvoicesPage;
