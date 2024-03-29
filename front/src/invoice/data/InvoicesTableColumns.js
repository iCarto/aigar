import {TextLink} from "base/navigation/components";
import {
    InvoiceGroupFieldsCellTable,
    InvoiceMonthCellTable,
    InvoiceStatusCellTable,
} from "../presentational";

export function useInvoicesTableColumns() {
    const tableColumns = [
        {
            label: "Socio/a",
            id: "nombre",
            formatFunction: item => {
                return <TextLink text={item.nombre} to={`/socios/${item.member_id}`} />;
            },
        },
        {
            label: "Sector",
            id: "sector",
        },
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
                <InvoiceGroupFieldsCellTable item={item} />;
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
