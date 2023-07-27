import {useEffect, useState} from "react";
import {InvoiceService} from "invoice/service";
import {createMemberInvoiceGroups} from "member/model";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {BarChart} from "base/chart";
import {
    InvoicesStatsList,
    InvoicesStatsFieldSelect,
    InvoicesStatOpenedMonthInfo,
} from "stats/presentational";
import {InvoicesStatsFilterForm} from ".";

import Grid from "@mui/material/Grid";

const ViewInvoicesStatsPage = () => {
    const [invoices, setInvoices] = useState(null);
    const [selectedField, setSelectedField] = useState("monto");
    const [filter, setFilter] = useState({
        startInvoicingMonth: "",
        endInvoicingMonth: "",
        sector: 0,
    });
    const fields = [
        {key: "monto", text: "Monto", unit: "$", unitClass: "dollar"},
        {key: "consumo", text: "Consumo", unit: "㎥", unitClass: "cubic-metre"},
        {key: "mora", text: "Mora", unit: "$", unitClass: "dollar"},
    ];

    useEffect(() => {
        InvoiceService.getInvoicesStats().then(invoices => {
            setInvoices(invoices);
        });
    }, []);

    const handleSelectedFieldChange = selectedField => {
        setSelectedField(selectedField);
    };

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({...prevFilter, ...newFilter}));
    };

    const filterInvoices = (invoices, filter) => {
        return invoices.filter(invoice => {
            var filtered = true;
            if (filter) {
                if (filter.startInvoicingMonth) {
                    filtered =
                        filtered &&
                        filter.startInvoicingMonth <= invoice.mes_facturacion;
                }
                if (filter.endInvoicingMonth) {
                    filtered =
                        filtered && filter.endInvoicingMonth >= invoice.mes_facturacion;
                }
                if (filter.sector) {
                    filtered = filtered && invoice.sector === parseInt(filter.sector);
                }
            }
            return filtered;
        });
    };

    const filteredInvoices = invoices ? filterInvoices(invoices, filter) : null;

    const getInvoicingMonths = invoices => {
        return [...new Set(invoices.map(invoice => invoice.mes_facturacion))];
    };

    const convertToMemberInvoiceGroup = invoices => {
        const memberInvoiceGroups = [];
        invoices.forEach(invoice => {
            const indexFound = memberInvoiceGroups.findIndex(
                memberInvoiceGroup => memberInvoiceGroup.num_socio === invoice.num_socio
            );
            if (indexFound >= 0) {
                memberInvoiceGroups[indexFound].invoices.push(invoice);
            } else {
                memberInvoiceGroups.push({
                    num_socio: invoice.num_socio,
                    nombre: invoice.nombre,
                    sector: invoice.sector,
                    invoices: [invoice],
                });
            }
        });
        return createMemberInvoiceGroups(memberInvoiceGroups);
    };

    const convertToMoraDataset = invoices => {
        let datasetMoraPorRetrasoData = [];
        let datasetMoraPorImpagoData = [];
        invoices.forEach(invoice => {
            const labelForInvoice = invoice.mes_facturacion;
            const indexFound = datasetMoraPorRetrasoData.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            if (indexFound >= 0) {
                datasetMoraPorRetrasoData[indexFound].value =
                    datasetMoraPorRetrasoData[indexFound].value +
                    invoice["mora_por_retraso"];
                datasetMoraPorImpagoData[indexFound].value =
                    datasetMoraPorImpagoData[indexFound].value +
                    invoice["mora_por_impago"];
            } else {
                datasetMoraPorRetrasoData.push({
                    label: labelForInvoice,
                    value: invoice["mora_por_retraso"],
                });
                datasetMoraPorImpagoData.push({
                    label: labelForInvoice,
                    value: invoice["mora_por_impago"],
                });
            }
        });
        return [
            {
                label: "Mora por retraso ($)",
                data: datasetMoraPorRetrasoData,
                backgroundColor: "#7aafdd",
            },
            {
                label: "Mora por impago ($)",
                data: datasetMoraPorImpagoData,
                backgroundColor: "#1c71bc",
            },
        ];
    };

    const convertToDataset = invoices => {
        if (selectedField === "mora") {
            return convertToMoraDataset(invoices);
        }
        const datasetData = [];
        invoices.forEach(invoice => {
            const labelForInvoice = invoice.mes_facturacion;
            const indexFound = datasetData.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            if (indexFound >= 0) {
                datasetData[indexFound].value =
                    datasetData[indexFound].value + invoice[selectedField];
            } else {
                datasetData.push({
                    label: labelForInvoice,
                    value: invoice[selectedField],
                });
            }
        });
        return [
            {
                label: getLabelFromSelectedField(),
                data: datasetData,
                backgroundColor: "#1c71bc",
            },
        ];
    };

    const getLabelFromSelectedField = () => {
        return getFieldTitle(selectedField) + " (" + getFieldUnit(selectedField) + ")";
    };

    const getFieldTitle = fieldKey => {
        return fields.find(field => field.key === fieldKey).text;
    };

    const getFieldUnit = fieldKey => {
        return fields.find(field => field.key === fieldKey).unit;
    };

    const getFieldUnitClass = fieldKey => {
        return fields.find(field => field.key === fieldKey).unitClass;
    };

    const formatInvoicingMonth = invoicingMonth => {
        return invoicingMonth.substring(4, 6) + "/" + invoicingMonth.substring(0, 4);
    };

    const displayStatsInfo = selectedField === "monto" && invoices;

    const statsInfo = displayStatsInfo ? (
        <InvoicesStatOpenedMonthInfo invoices={invoices} />
    ) : null;

    return (
        <PageLayout>
            {invoices ? (
                <>
                    <Grid item container alignItems="flex-end">
                        <Grid item xs={10} md={8}>
                            <InvoicesStatsFilterForm
                                filter={filter}
                                onFilterChange={handleFilterChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        justifyContent="space-between"
                        alignItems="flex-end"
                        mt={displayStatsInfo ? "-48px" : 0}
                    >
                        <InvoicesStatsFieldSelect
                            fields={fields}
                            selectedField={selectedField}
                            handleChange={handleSelectedFieldChange}
                        />
                        {statsInfo}
                    </Grid>
                    <Grid item>
                        <InvoicesStatsList
                            invoicingMonths={getInvoicingMonths(filteredInvoices)}
                            invoicesStats={convertToMemberInvoiceGroup(
                                filteredInvoices
                            )}
                            selectedField={selectedField}
                            unitClass={getFieldUnitClass(selectedField)}
                        />
                    </Grid>
                    <Grid item mt={3} maxWidth="50%">
                        <BarChart
                            dataLabels={getInvoicingMonths(filteredInvoices)}
                            dataLabelsFormat={formatInvoicingMonth}
                            dataDatasets={convertToDataset(filteredInvoices)}
                        />
                    </Grid>
                </>
            ) : (
                <Spinner message="Cargando datos" />
            )}
        </PageLayout>
    );
};

export default ViewInvoicesStatsPage;
