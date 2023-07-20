import {useEffect, useState} from "react";
import {InvoicingMonthService} from "service/api";
import {Spinner} from "components/common";
import {
    InvoicesListPreview,
    LoadDataTableFilter,
} from "components/common/loaddata/table";

const LoadMeasurementsStep3InvoicesTable = ({
    id_mes_facturacion,
    measurements,
    onChangeInvoices,
    onValidateStep,
    invoices,
}) => {
    const [filter, setFilter] = useState({
        text: "",
    });
    const [measurementsWithoutInvoice, setMeasurementsWithoutInvoice] = useState([]);

    useEffect(() => {
        InvoicingMonthService.previewInvoicesWithMeasurements(
            id_mes_facturacion,
            measurements
        )
            .then(invoices => {
                reviewMeasurements(measurements, invoices);
                onChangeInvoices(invoices);
                onValidateStep(true);
            })
            .catch(error => {
                onValidateStep(false);
            });
    }, [id_mes_facturacion, measurements]);

    const reviewMeasurements = (measurements, invoices) => {
        let measurementsWithoutInvoice = [];
        measurements.forEach(measurement => {
            const invoice = invoices.find(
                invoice => invoice.num_socio === measurement.num_socio
            );
            if (invoice) {
                if (invoice.caudal_anterior !== measurement.caudal_anterior) {
                    invoice.errors.push(
                        "No coincide la lectura anterior (" +
                            invoice.caudal_anterior +
                            ")"
                    );
                }
            } else {
                measurementsWithoutInvoice.push(measurement.num_socio);
            }
        });
        setMeasurementsWithoutInvoice(measurementsWithoutInvoice);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevState => ({...prevState, ...newFilter}));
    };

    const filterByText = (invoice, filterText) => {
        return (
            invoice.numero.indexOf(filterText) >= 0 ||
            invoice.num_socio.toString().indexOf(filterText) >= 0 ||
            invoice.nombre.toLowerCase().indexOf(filterText.toLowerCase()) >= 0
        );
    };

    const filterMeasurements = invoices => {
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

    const measurementsWithoutInvoiceError = () => {
        if (measurementsWithoutInvoice.length !== 0) {
            return (
                <div className="alert alert-danger text-center" role="alert">
                    <strong>
                        Se han detectado lecturas para socios que no tienen factura:{" "}
                        {measurementsWithoutInvoice.join(",")}
                    </strong>
                </div>
            );
        }
        return null;
    };

    const filteredInvoices = invoices ? filterMeasurements(invoices) : [];

    return (
        <div className="d-flex flex-column justify-content-around">
            {invoices ? (
                <>
                    {measurementsWithoutInvoiceError()}
                    {messagesError()}
                    <LoadDataTableFilter
                        filter={filter}
                        handleChange={handleFilterChange}
                    />
                    <InvoicesListPreview
                        invoices={filteredInvoices}
                        invoicesTableType="measurements"
                    />
                </>
            ) : (
                <Spinner message="Cargando facturas" />
            )}
        </div>
    );
};

export default LoadMeasurementsStep3InvoicesTable;
