import {useEffect, useState} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {Spinner} from "base/common";
import {InvoicesListPreview} from "invoice/presentational";
import {LoadDataTableFilter} from "loaddata/presentational";
import Alert from "@mui/material/Alert";

const LoadMeasurementsStep3InvoicesTable = ({
    id_mes_facturacion,
    measurements,
    onChangeInvoices,
    onValidateStep,
    invoices,
}) => {
    const [filter, setFilter] = useState({
        text: "",
        showOnlyErrors: false,
    });
    const [measurementsWithoutInvoice, setMeasurementsWithoutInvoice] = useState([]);
    const {filterMonthlyData} = useFilterMonthlyData();

    useEffect(() => {
        onValidateStep(false);
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
                console.log(error);
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

    const getTotalErrors = items => {
        return items.filter(item => item.errors.length !== 0).length;
    };

    const getErrorMessages = () => {
        const totalInvoicesWithErrors = getTotalErrors(invoices);
        if (totalInvoicesWithErrors !== 0) {
            return (
                <Alert severity="error">
                    Existen <strong>{totalInvoicesWithErrors}</strong> facturas con
                    alertas que debería revisar.
                </Alert>
            );
        }
        return null;
    };

    const getMeasurementsWithoutInvoiceError = () => {
        if (measurementsWithoutInvoice.length !== 0) {
            return (
                <Alert severity="error">
                    <strong>
                        Se han detectado lecturas para socios que no tienen factura:{" "}
                        {measurementsWithoutInvoice.join(",")}
                    </strong>
                </Alert>
            );
        }
        return null;
    };

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    return (
        <div className="d-flex flex-column justify-content-around">
            {invoices ? (
                <>
                    {getMeasurementsWithoutInvoiceError()}
                    {getErrorMessages()}
                    <LoadDataTableFilter
                        filter={filter}
                        onChange={handleFilterChange}
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
