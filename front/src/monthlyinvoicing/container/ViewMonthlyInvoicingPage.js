import {useEffect, useState} from "react";

import ListMonthlyInvoices from "./ListMonthlyInvoices";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {PageLayout} from "base/ui/page";
import {ListMonthlyInvoicesSidebar} from ".";
import {Spinner} from "base/common";
import {NoItemsMessage} from "base/error/components";
import InvoiceStatusIcon from "invoice/presentational/InvoiceStatusIcon";

const ViewMonthlyInvoicingPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState(null);
    const [selectedInvoicingMonth, setSelectedInvoicingMonth] = useState(null);
    const [filteredInvoicesIds, setFilteredInvoicesIds] = useState([]);
    const [filteredInvoices, setFilderedInvoices] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [filter, setFilter] = useState({
        nombre: "",
        sector: 0,
        tipo_socio: 0,
        estado: 0,
    });

    console.log(invoices);

    useEffect(() => {
        setFilderedInvoices(filterInvoices(invoices, filter));
    }, [selectedInvoicingMonth, filter]);

    useEffect(() => {
        setIsLoading(true);
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
            )
            .finally(() => setIsLoading(false));
    }, []);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
        // setListView(prevListView => ({
        //     ...prevListView,
        //     pageIndex: 0,
        // }));
    };

    const handleChangeInvoicingMonth = selectedInvoicingMonth => {
        console.log("handleChangeInvoicingMonth");
        setSelectedInvoicingMonth(selectedInvoicingMonth);
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

    const filterInvoices = (invoices, filter) => {
        if (invoices) {
            return invoices.filter(invoice => {
                var filtered = true;
                if (filter) {
                    if (filter.nombre) {
                        filtered =
                            filtered &&
                            invoice.nombre
                                .toLowerCase()
                                .indexOf(filter.nombre.toLowerCase()) >= 0;
                    }
                    if (filter.sector) {
                        filtered =
                            filtered && invoice.sector === parseInt(filter.sector);
                    }
                    if (filter.tipo_socio) {
                        filtered = filtered && invoice.tipo_socio === filter.tipo_socio;
                    }
                    if (filter.estado) {
                        filtered = filtered && invoice.estado === filter.estado;
                    }
                }
                return filtered;
            });
        }
        return null;
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
                        handleFilterChange={undefined}
                    />
                ) : null
            }
        >
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <>
                    <ListMonthlyInvoices
                        handleFilterChange={handleFilterChange}
                        filter={filter}
                        invoicingMonths={invoicingMonths}
                        invoices={invoices}
                        selectedInvoicingMonth={selectedInvoicingMonth}
                        handleChangeInvoicingMonth={handleChangeInvoicingMonth}
                    />
                    <NoItemsMessage itemsLength={invoices?.length} />
                </>
            )}
        </PageLayout>
    );
};

export default ViewMonthlyInvoicingPage;
