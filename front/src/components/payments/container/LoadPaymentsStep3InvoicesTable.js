import {useState, useEffect} from "react";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";
import {
    InvoicesListPreview,
    LoadDataTableFilter,
} from "components/common/loaddata/table";

const LoadPaymentsStep3InvoicesTable = ({
    id_mes_facturacion,
    payments,
    onChangeInvoices,
    onValidateStep,
    invoices,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const filterByText = (invoice, filterText) => {
        return (
            invoice.numero.indexOf(filterText) >= 0 ||
            invoice.num_socio.toString().indexOf(filterText) >= 0 ||
            invoice.nombre.toString().toLowerCase().indexOf(filterText.toLowerCase()) >=
                0
        );
    };

    const filterInvoices = invoices => {
        return invoices.filter(invoice => {
            let filtered = true;
            if (filter.text != null && filter.text !== "") {
                filtered = filterByText(invoice, filter.text);
            }
            if (filter.showOnlyErrors === "true") {
                filtered = filtered && invoice.errors.length !== 0;
            }
            return filtered;
        });
    };

    const messagesError = () => {
        const totalInvoicesWithErrors = invoices.filter(
            invoice => invoice.errors.length !== 0
        ).length;
        if (totalInvoicesWithErrors !== 0) {
            return (
                <div className="alert alert-warning text-center" role="alert">
                    Existen <strong>{totalInvoicesWithErrors}</strong> facturas con
                    alertas que debería revisar.
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        if (!invoices) {
            InvoicingMonthService.previewInvoicesWithPayments(
                id_mes_facturacion,
                payments
            )
                .then(fetchedInvoices => {
                    onChangeInvoices(fetchedInvoices);
                    onValidateStep(true);
                })
                .catch(error => {
                    onValidateStep(false);
                });
        }
    }, [id_mes_facturacion, invoices, payments, onChangeInvoices, onValidateStep]);

    const filteredInvoices = invoices ? filterInvoices(invoices) : [];

    return (
        <div className="d-flex flex-column justify-content-around">
            {invoices ? (
                <>
                    {messagesError()}
                    <LoadDataTableFilter
                        filter={filter}
                        handleChange={handleFilterChange}
                    />
                    <InvoicesListPreview
                        invoices={filteredInvoices}
                        invoicesTableType="payments"
                    />
                </>
            ) : (
                <Spinner message="Cargando facturas" />
            )}
        </div>
    );
};

export default LoadPaymentsStep3InvoicesTable;
