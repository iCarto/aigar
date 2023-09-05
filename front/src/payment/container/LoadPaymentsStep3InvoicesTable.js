import {useState, useEffect} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {LoadDataTableFilter} from "loaddata/presentational";
import {InvoicesListPreview} from "invoice/presentational";
import {Spinner} from "base/common";
import Alert from "@mui/material/Alert";

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

    const {filterMonthlyData} = useFilterMonthlyData();

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    useEffect(() => {
        if (!invoices.length) {
            onValidateStep(false);
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

    const totalInvoicesWithErrors = invoices.filter(
        invoice => invoice.errors.length !== 0
    ).length;

    const errorsMessage = (
        <Alert severity="error">
            Existen <strong>{totalInvoicesWithErrors}</strong> facturas con alertas que
            debería revisar.
        </Alert>
    );

    return (
        <div className="d-flex flex-column justify-content-around">
            {invoices ? (
                <>
                    {totalInvoicesWithErrors ? errorsMessage : null}
                    <LoadDataTableFilter
                        filter={filter}
                        onChange={handleFilterChange}
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
