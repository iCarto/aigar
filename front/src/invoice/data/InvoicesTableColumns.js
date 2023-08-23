import {LinkCellTable} from "base/table/components";
import {
    InvoiceGroupFieldsCellTable,
    InvoiceMonthCellTable,
    InvoiceStatusCellTable,
} from "../presentational";

export function useInvoicesTableColumns() {
    const tableColumns = [
        {
            label: "Socio",
            id: "nombre",
            formatFunction: item => {
                return (
                    <LinkCellTable
                        text={item.nombre}
                        to={`/socios/${item.num_socio}`}
                    />
                );
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
                return <LinkCellTable text={item.numero} to={`id_factura`} />;
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
            style: {textAlign: "right"},
        },
        {
            label: "Caudal actual",
            id: "caudal_actual",
            className: "cubic-metre",
            style: {textAlign: "right"},
        },
        {
            label: "Consumo",
            id: "consumo",
            className: "cubic-metre",
            style: {textAlign: "right"},
        },
        {
            label: "Mora",
            id: "mora",
            className: "dollar",
            style: {textAlign: "right"},
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
            className: "dollar font-weight-bold",
            style: {textAlign: "right"},
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
