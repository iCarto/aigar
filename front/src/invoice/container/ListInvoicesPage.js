import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {InvoiceService} from "invoice/service";
import ListInvoices from "./ListInvoices";
import {PageLayout} from "base/ui/page";

const ListInvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [filter, setFilter] = useState({
        numero: "",
        nombre: "",
        sector: 0,
    });
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        InvoiceService.getInvoices().then(invoices => {
            setInvoices(invoices);
        });
    }, []);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
        // setListView(prevListView => ({...prevListView, pageIndex: 0}));
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
                invoices={invoices}
                handleFilterChange={handleFilterChange}
                filter={filter}
            />
        </PageLayout>
    );
};

export default ListInvoicesPage;
