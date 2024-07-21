import {TextLink} from "base/navigation/components";
import {
    InvoiceGroupFieldsCellTable,
    InvoiceMonthCellTable,
    InvoiceStatusCellTable,
} from "invoice/presentational";

export function useMemberInvoicesTableColumns() {
    const tableColumns = [
        {
            label: "Número",
            id: "numero",
            formatFunction: item => {
                return <TextLink text={item.numero} to={`/facturas/${item.id}`} />;
            },
        },
        {
            label: "Mes",
            id: "mes_facturacion",
            formatFunction: item => {
                return <InvoiceMonthCellTable item={item} />;
            },
        },
        {
            label: "Caudal anterior",
            id: "caudal_anterior",
            className: "cubic-metre",
        },
        {
            label: "Caudal actual",
            id: "caudal_actual",
            className: "cubic-metre",
        },
        {
            label: "Consumo",
            id: "consumo",
            className: "cubic-metre",
        },
        {
            label: "Mora",
            id: "mora",
            className: "dollar",
        },
        {
            label: "Otros",
            formatFunction: item => {
                return <InvoiceGroupFieldsCellTable item={item} />;
            },
        },
        {
            label: "Total",
            id: "total",
            className: "dollar bold",
        },
        {
            label: "Estado",
            id: "estado",
            formatFunction: item => {
                return <InvoiceStatusCellTable value={item.estado} />;
            },
        },
    ];
    return {tableColumns};
}
