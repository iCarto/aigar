import {BarChart} from "base/chart";

const InvoicesStatsBarChart = ({invoices, invoicingMonths, fields, selectedField}) => {
    const convertToMoraDataset = invoices => {
        let datasetMoraPorRetrasoData = [];
        let datasetMoraPorImpagoData = [];
        invoices?.forEach(invoice => {
            const labelForInvoice = invoice.mes_facturacion;
            const indexFound = datasetMoraPorRetrasoData.findIndex(
                dataset => dataset.label === labelForInvoice
            );
            const mora_por_retraso = invoice["mora_por_retraso"] ? 1 : 0;
            const mora_por_impago = invoice["mora_por_impago"] ? 1 : 0;
            if (indexFound >= 0) {
                datasetMoraPorRetrasoData[indexFound].value += mora_por_retraso;
                datasetMoraPorImpagoData[indexFound].value += mora_por_impago;
            } else {
                datasetMoraPorRetrasoData.push({
                    label: labelForInvoice,
                    value: mora_por_retraso,
                });
                datasetMoraPorImpagoData.push({
                    label: labelForInvoice,
                    value: mora_por_impago,
                });
            }
        });
        return [
            {
                label: "Mora por retraso",
                data: datasetMoraPorRetrasoData,
                backgroundColor: "#7aafdd",
            },
            {
                label: "Mora por impago",
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
        invoices?.forEach(invoice => {
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

    const formatInvoicingMonth = invoicingMonth => {
        return invoicingMonth.substring(4, 6) + "/" + invoicingMonth.substring(0, 4);
    };

    const dataDatasets = convertToDataset(invoices);

    return (
        <BarChart
            dataLabels={invoicingMonths}
            dataLabelsFormat={formatInvoicingMonth}
            dataDatasets={dataDatasets}
        />
    );
};

export default InvoicesStatsBarChart;
