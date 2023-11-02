import {useEffect, useState} from "react";

import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";
import {InvoicesListPreview} from "invoice/presentational";
import {LoadDataTableFilter} from "loaddata/presentational";
import {ErrorMessage} from "base/error/components";
import {Spinner} from "base/ui/other/components";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

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

    const filteredInvoices = invoices ? filterMonthlyData(invoices, filter) : [];

    useEffect(() => {
        onValidateStep(false);
        InvoicingMonthService.previewInvoicesWithMeasurements(measurements)
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
                invoice => invoice.member_id === measurement.member_id
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
                measurementsWithoutInvoice.push(measurement.member_id);
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

    const totalInvoicesWithErrors = getTotalErrors(invoices);

    const errorsMessage = (
        <Typography>
            Existen <strong>{totalInvoicesWithErrors}</strong> facturas con alertas que
            debería revisar.
        </Typography>
    );

    const measurementsWithoutInvoiceMessage = (
        <Typography fontWeight={700}>
            Se han detectado lecturas para socios que no tienen factura:{" "}
            {measurementsWithoutInvoice.join(", ")}
        </Typography>
    );

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-around">
            {invoices.length ? (
                <>
                    {totalInvoicesWithErrors ? (
                        <ErrorMessage message={errorsMessage} />
                    ) : null}
                    {measurementsWithoutInvoice.length ? (
                        <ErrorMessage message={measurementsWithoutInvoiceMessage} />
                    ) : null}
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
        </Box>
    );
};

export default LoadMeasurementsStep3InvoicesTable;
