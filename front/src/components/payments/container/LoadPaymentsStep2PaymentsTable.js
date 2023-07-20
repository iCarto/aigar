import {useState, useEffect} from "react";
import {LoadDataValidatorService} from "service/validation";
import {createPayment} from "model";
import {Spinner} from "components/common";
import {LoadPaymentsList} from "../presentation";
import {LoadDataTableFilter} from "components/common/loaddata/table";
import {InvoicingMonthService} from "service/api";

const LoadPaymentsStep2PaymentsTable = ({
    id_mes_facturacion,
    payments,
    onChangePayments,
    onValidateStep,
}) => {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });
    const [invoices, setInvoices] = useState(null);

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
        reviewPayments(updatedPayments);
    };

    const getPaymentsTotalErrors = payments => {
        return payments.filter(payment => payment.errors.length !== 0).length;
    };

    const findInvoiceForPayment = payment => {
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

    const reviewPayments = payments => {
        const paymentsWithErrors = payments.map(payment => {
            const invoiceForPayment = findInvoiceForPayment(payment);
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

    useEffect(() => {
        setLoading(true);
        InvoicingMonthService.getInvoicingMonthInvoices(id_mes_facturacion).then(
            invoices => {
                setInvoices(invoices);
                setLoading(false);
                reviewPayments(payments);
            }
        );
    }, [id_mes_facturacion, payments]);

    const totalRegistersWithErrors = getPaymentsTotalErrors(payments);

    if (loading) {
        return <Spinner message="Verificando pagos" />;
    }

    if (payments) {
        const paymentsFiltered = filterPayments(payments);

        return (
            <div className="d-flex flex-column justify-content-around">
                {totalRegistersWithErrors !== 0 && (
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
                    handleFilterChange={handleFilterChange}
                    onUpdatePayment={handleUpdatePayment}
                />
            </div>
        );
    }

    return <Spinner message="Cargando lecturas" />;
};

export default LoadPaymentsStep2PaymentsTable;
