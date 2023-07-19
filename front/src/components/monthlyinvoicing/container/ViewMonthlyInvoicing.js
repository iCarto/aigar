import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {InvoicingMonthService} from "service/api";
import ListMonthlyInvoices from "./ListMonthlyInvoices";
import "components/common/SideBar.css";

const ViewMonthlyInvoicing = () => {
    const [invoices, setInvoices] = useState(null);
    const [invoicingMonths, setInvoicingMonths] = useState(null);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);
    const [listView, setListView] = useState({
        sortBy: [],
        pageIndex: 0,
    });
    const [filter, setFilter] = useState({
        nombre: "",
        sector: 0,
        tipo_socio: 0,
        estado: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
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
            );
    }, []);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
        setListView(prevListView => ({
            ...prevListView,
            pageIndex: 0,
        }));
    };

    const handleClickViewInvoice = (idFactura, filteredInvoicesIds) => {
        console.log("handleClickViewInvoice", idFactura, filteredInvoicesIds);
        // if (!filteredInvoicesIds) {
        //     setFilteredInvoicesIds(filteredInvoicesIds);
        // }
        // setSelectedInvoice(idFactura);
        // setFilteredInvoicesIds(filteredInvoicesIds);
        navigate(`facturas/${idFactura}`);
    };

    const handleClickViewMember = numero_socio => {
        console.log("handleSelectMember", numero_socio);
        navigate(`socios/${numero_socio}`);
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        console.log("handleChangeInvoicingMonth");
        setSelectedInvoicingMonth(selectedInvoicingMonth);
    };

    const handleSuccessCreateInvoices = () => {
        console.log("handleSuccessCreateInvoices");
        // loadInvoicingMonths();
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
        <>
            {selectedInvoicingMonth && invoices ? (
                <ListMonthlyInvoices
                    listView={listView}
                    handleFilterChange={handleFilterChange}
                    // handleChangeListView={handleChangeListView}
                    handleClickViewInvoice={handleClickViewInvoice}
                    handleClickViewMember={handleClickViewMember}
                    filter={filter}
                    invoicingMonths={invoicingMonths}
                    invoices={invoices}
                    selectedInvoicingMonth={selectedInvoicingMonth}
                    handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                    handleSuccessCreateInvoices={handleSuccessCreateInvoices}
                />
            ) : null}
        </>
    );
};

export default ViewMonthlyInvoicing;
