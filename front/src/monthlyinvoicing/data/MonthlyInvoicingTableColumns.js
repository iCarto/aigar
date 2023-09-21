import {MEMBER_TYPES_MAPPING} from "member/data";
import {InvoiceResumenCellTable, InvoiceStatusCellTable} from "invoice/presentational";
import {ValueWithIcon} from "base/common";
import {LinkCellTable} from "base/table/components";

export function useMonthlyInvoicingTableColumns() {
    const tableColumns = [
        {
            id: "status",
            formatFunction: item => {
                return (
                    <ValueWithIcon
                        icon={MEMBER_TYPES_MAPPING[item?.status]?.icon}
                        title={MEMBER_TYPES_MAPPING[item?.status]?.label}
                    />
                );
            },
            style: {textAlign: "center"},
        },
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
            label: "Nº Factura",
            id: "numero",
            formatFunction: item => {
                return (
                    <LinkCellTable
                        text={item.numero}
                        to={`/facturas_mes/${item.id_factura}`}
                    />
                );
            },
        },
        {
            label: "Lectura",
            id: "consumo",
            className: "cubic-metre",
            style: {textAlign: "right"},
        },
        {
            label: "Importe",
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
        {
            label: "Meses previos",
            id: "resumen",
            formatFunction: item => {
                return <InvoiceResumenCellTable value={item.resumen} />;
            },
            style: {textAlign: "center"},
        },
    ];

    return {tableColumns};
}
