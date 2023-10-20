import {createMemberInvoiceGroups} from "member/model";
import {InvoicesStatsTable, InvoicesStatsBarChart} from "stats/presentational";
import Grid from "@mui/material/Grid";

const InvoicesStatsList = ({invoices, views, currentView}) => {
    const convertToMemberInvoiceGroup = invoices => {
        const memberInvoiceGroups = [];
        invoices?.forEach(invoice => {
            const indexFound = memberInvoiceGroups.findIndex(
                memberInvoiceGroup => memberInvoiceGroup.id === invoice.member_data.id
            );
            if (indexFound >= 0) {
                memberInvoiceGroups[indexFound].invoices.push(invoice);
            } else {
                memberInvoiceGroups.push({
                    id: invoice.member_data.id,
                    nombre: invoice.member_data.name,
                    sector: invoice.member_data.sector,
                    invoices: [invoice],
                });
            }
        });
        return createMemberInvoiceGroups(memberInvoiceGroups);
    };

    const unitClass = views.find(view => view.key === currentView).unitClass;
    const invoicingMonths = [
        ...new Set(invoices?.map(invoice => invoice.mes_facturacion)),
    ];
    const memberInvoiceGroups = convertToMemberInvoiceGroup(invoices);

    return (
        <>
            <Grid item>
                <InvoicesStatsTable
                    invoicingMonths={invoicingMonths}
                    invoicesStats={memberInvoiceGroups}
                    selectedField={currentView}
                    unitClass={unitClass}
                />
            </Grid>
            <Grid item mt={3} maxWidth="50%">
                <InvoicesStatsBarChart
                    invoices={invoices}
                    invoicingMonths={invoicingMonths}
                    fields={views}
                    selectedField={currentView}
                />
            </Grid>
        </>
    );
};

export default InvoicesStatsList;
