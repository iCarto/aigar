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

    // TO-DO: Review if this is still needed somehow
    // const handleSuccessCreateNewInvoiceVersion = (
    //     new_version_id_factura,
    //     old_version_id_factura
    // ) => {
    //     // Replace old version id
    //     const updatedFilteredInvoicesIds = filteredInvoicesIds.map(invoiceId =>
    //         invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
    //     );
    //     setFilteredInvoicesIds(updatedFilteredInvoicesIds);
    // };

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
