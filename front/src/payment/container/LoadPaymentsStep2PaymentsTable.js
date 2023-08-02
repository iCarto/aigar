import {useState, useEffect} from "react";
import {LoadDataValidatorService} from "validation";

import {Spinner} from "base/common";
import {LoadPaymentsList} from "../presentational";
import {LoadDataTableFilter} from "base/loaddata/table";
import createPayment from "model/Payment";
import {InvoicingMonthService} from "monthlyinvoicing/service";

const LoadPaymentsStep2PaymentsTable = ({
    id_mes_facturacion,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const [invoices, setInvoices] = useState([]);
    // TO-DO: Handle filter from useList()
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        InvoicingMonthService.getInvoicingMonthInvoices(id_mes_facturacion).then(
            invoices => {
                setInvoices(invoices);
                reviewPayments(payments, invoices);
                setLoading(false);
            }
        );
    }, [id_mes_facturacion]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const handleUpdatePayment = (rowId, columnId, value) => {
        const updatedPayments = payments.map(payment => {
            if (payment.id === rowId) {
                const updatedPayment = createPayment({
                    ...payment,
                    [columnId]: value,
                });
                return updatedPayment;
            }
            return payment;
        });
        console.log({updatedPayments});
        reviewPayments(updatedPayments, invoices);
    };

    const getPaymentsTotalErrors = payments => {
        return payments.filter(payment => payment.errors.length !== 0).length;
    };

    const findInvoiceForPayment = (payment, invoices) => {
        let invoiceForPayment = invoices.find(
            invoice => invoice.numero === payment.num_factura
        );
        if (!invoiceForPayment) {
            invoiceForPayment = invoices.find(
                invoice => invoice.num_socio === payment.num_socio
            );
        }
        return invoiceForPayment;
    };

    const reviewPayments = (payments, invoices) => {
        const paymentsWithErrors = payments?.map(payment => {
            const invoiceForPayment = findInvoiceForPayment(payment, invoices);
            let invoiceFieldsForPayment = {};
            if (invoiceForPayment) {
                invoiceFieldsForPayment = {
                    num_socio: invoiceForPayment.num_socio,
                    nombre_socio: invoiceForPayment.nombre,
                    sector: invoiceForPayment.sector,
                    id_factura: invoiceForPayment.id_factura,
                };
            }
            return createPayment({
                ...payment,
                ...invoiceFieldsForPayment,
                errors: LoadDataValidatorService.validatePaymentEntry(
                    payment,
                    invoiceForPayment
                ),
            });
        });
        onChangePayments(paymentsWithErrors);
        onValidateStep(getPaymentsTotalErrors(paymentsWithErrors) === 0);
    };

    const filterByText = (payment, filterText) => {
        return (
            payment.nombre_socio.indexOf(filterText) >= 0 ||
            payment.num_socio.toString().indexOf(filterText) >= 0 ||
            payment.num_factura.toString().indexOf(filterText) >= 0 ||
            payment.fecha.toString().indexOf(filterText) >= 0
        );
    };

    const filterPayments = payments => {
        return payments.filter(payment => {
            let filtered = true;
            if (filter.text !== null && filter.text !== "") {
                filtered = filterByText(payment, filter.text);
            }
            if (filter.showOnlyErrors === "true") {
                filtered = filtered && payment.errors.length !== 0;
            }
            return filtered;
        });
    };

    const totalRegistersWithErrors = getPaymentsTotalErrors(payments);

    if (loading) {
        return <Spinner message="Verificando pagos" />;
    }

    if (payments.length) {
        const paymentsFiltered = filterPayments(payments);

        return (
            <div className="d-flex flex-column justify-content-around">
                {totalRegistersWithErrors && (
                    <div className="alert alert-danger text-center" role="alert">
                        Existen <strong>{totalRegistersWithErrors}</strong> registros
                        con error de un total de <strong>{payments.length}</strong>{" "}
                        registros leídos.
                    </div>
                )}
                <LoadDataTableFilter
                    filter={filter}
                    handleChange={handleFilterChange}
                />
                <LoadPaymentsList
                    payments={paymentsFiltered}
                    onUpdatePayment={handleUpdatePayment}
                />
            </div>
        );
    }

    return <Spinner message="Cargando lecturas" />;
};

export default LoadPaymentsStep2PaymentsTable;
