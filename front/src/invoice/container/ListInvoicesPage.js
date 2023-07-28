import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";
import {PageLayout} from "base/ui/page";
import {ListInvoices} from ".";

const ListInvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();
    const navigate = useNavigate();

    useEffect(() => {
        InvoiceService.getInvoices().then(invoices => {
            setInvoices(invoices);
        });
    }, []);

    useEffect(() => {
        setFilteredInvoices(filterFunction(invoices));
    }, [invoices, filter]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
    };

    const handleClickViewInvoice = (idFactura, filteredInvoicesIds) => {
        console.log("handleClickEditInvoice", idFactura, filteredInvoicesIds);
        // if (!filteredInvoicesIds) {
        //     filteredInvoicesIds = filteredInvoicesIds;
        // }
        // setSelectedInvoice(idFactura);
        setFilteredInvoicesIds(filteredInvoicesIds);
        navigate(`${idFactura}`);
    };

    const handleSuccessCreateNewInvoiceVersion = (
        new_version_id_factura,
        old_version_id_factura
    ) => {
        // Replace old version id
        const updatedFilteredInvoicesIds = filteredInvoicesIds.map(invoiceId =>
            invoiceId === old_version_id_factura ? new_version_id_factura : invoiceId
        );
        setFilteredInvoicesIds(updatedFilteredInvoicesIds);
    };

    return (
        <PageLayout>
            <ListInvoices
                invoices={filteredInvoices}
                handleFilterChange={handleFilterChange}
            />
        </PageLayout>
    );
};

export default ListInvoicesPage;
