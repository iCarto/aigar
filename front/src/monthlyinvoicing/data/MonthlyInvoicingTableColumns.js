import {MEMBER_TYPES_MAPPING} from "member/config";
import {InvoiceResumenCellTable, InvoiceStatusCellTable} from "invoice/presentational";
import {ValueWithIcon} from "base/ui/other/components";
import {TextLink} from "base/navigation/components";

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
        },
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
            label: "Nº Recibo",
            id: "numero",
            formatFunction: item => {
                return <TextLink text={item.numero} to={`/facturas_mes/${item.id}`} />;
            },
        },
        {
            label: "Lectura",
            id: "consumo",
            className: "cubic-metre",
        },
        {
            label: "Importe",
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
        {
            label: "Meses previos",
            id: "resumen",
            formatFunction: item => {
                return <InvoiceResumenCellTable value={item.resumen} />;
            },
        },
    ];

    return {tableColumns};
}
