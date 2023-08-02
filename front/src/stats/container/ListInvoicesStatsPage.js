import {createMemberInvoiceGroups} from "member/model";
import {
    InvoicesStatsList,
    InvoicesStatsFieldSelect,
    InvoicesStatOpenedMonthInfo,
    InvoicesStatsBarChart,
} from "stats/presentational";
import Grid from "@mui/material/Grid";

const ListInvoicesStatsPage = ({invoices, onChangeStatsField, currentField}) => {
    const fields = [
        {key: "monto", text: "Monto", unit: "$", unitClass: "dollar"},
        {key: "consumo", text: "Consumo", unit: "㎥", unitClass: "cubic-metre"},
        {key: "mora", text: "Mora", unit: "$", unitClass: "dollar"},
    ];

    const handleChangeStatsField = selectedField => {
        onChangeStatsField(selectedField);
    };

    const convertToMemberInvoiceGroup = invoices => {
        const memberInvoiceGroups = [];
        invoices?.forEach(invoice => {
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

    const unitClass = fields.find(field => field.key === currentField).unitClass;
    const invoicingMonths = [
        ...new Set(invoices?.map(invoice => invoice.mes_facturacion)),
    ];
    const memberInvoiceGroups = convertToMemberInvoiceGroup(invoices);

    const displayStatsInfo = currentField === "monto" && invoices;

    const statsInfo = displayStatsInfo ? (
        <InvoicesStatOpenedMonthInfo invoices={invoices} />
    ) : null;

    return (
        <>
            <Grid
                item
                container
                justifyContent="space-between"
                alignItems="flex-end"
                mt={displayStatsInfo ? "-48px" : 0}
            >
                <InvoicesStatsFieldSelect
                    fields={fields}
                    selectedField={currentField}
                    handleChange={handleChangeStatsField}
                />
                {statsInfo}
            </Grid>
            <Grid item>
                <InvoicesStatsList
                    invoicingMonths={invoicingMonths}
                    invoicesStats={memberInvoiceGroups}
                    selectedField={currentField}
                    unitClass={unitClass}
                />
            </Grid>
            <Grid item mt={3} maxWidth="50%">
                <InvoicesStatsBarChart
                    invoices={invoices}
                    invoicingMonths={invoicingMonths}
                    fields={fields}
                    selectedField={currentField}
                />
            </Grid>
        </>
    );
};

export default ListInvoicesStatsPage;