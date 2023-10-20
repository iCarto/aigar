import {NumberUtil} from "base/format/utilities";
import useTheme from "@mui/material/styles/useTheme";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

const InvoicesStatOpenedMonthInfo = ({invoices}) => {
    const theme = useTheme();

    const debt = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["deuda"];
        }, 0);
    const monto = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["monto"];
        }, 0);
    const total = invoices
        .filter(invoice => invoice["mes_abierto"])
        .reduce((total, invoice) => {
            return total + invoice["total"];
        }, 0);

    const invoicingInfoItems = [
        {label: "Facturación total", value: total},
        {label: "Cobrado", value: monto},
        {label: "Deuda", value: debt},
    ];

    return (
        <Paper sx={{p: 2, py: 1, backgroundColor: "grey.300"}}>
            <Typography color="text.secondary" sx={{fontSize: 14}} gutterBottom>
                Facturación del mes abierto:
            </Typography>
            <List disablePadding>
                {invoicingInfoItems.map(item => (
                    <ListItem
                        key={item.label}
                        disableGutters
                        disablePadding
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{fontWeight: "normal", textTransform: "uppercase"}}
                        >
                            {item.label}:
                        </Typography>
                        <Typography
                            className="dollar"
                            fontWeight={600}
                            color={
                                item.label === "Deuda"
                                    ? theme.palette.error.main
                                    : "inherit"
                            }
                        >
                            {NumberUtil.formatNumber(item.value)}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default InvoicesStatOpenedMonthInfo;
