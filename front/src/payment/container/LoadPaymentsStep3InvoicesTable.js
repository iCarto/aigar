import {useState, useEffect} from "react";

import {Spinner} from "base/common";
import {InvoicesListPreview, LoadDataTableFilter} from "base/loaddata/table";
import {InvoicingMonthService} from "monthlyinvoicing/service";

const LoadPaymentsStep3InvoicesTable = ({
    invoices,
    payments,
    id_mes_facturacion,
    onChangeInvoices,
    onValidateStep,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });

    useEffect(() => {
        if (!invoices.length) {
            InvoicingMonthService.previewInvoicesWithPayments(
                id_mes_facturacion,
                payments
            )
                .then(fetchedInvoices => {
                    onChangeInvoices(fetchedInvoices);
                    onValidateStep(true);
                })
                .catch(error => {
                    console.log(error);
                    onValidateStep(false);
                });
        }
    }, [id_mes_facturacion, invoices, payments]);

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

    const filteredInvoices = invoices ? filterInvoices(invoices) : [];

    const getErrorMessages = () => {
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

    return (
        <div className="d-flex flex-column justify-content-around">
            {invoices ? (
                <>
                    {getErrorMessages()}
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
