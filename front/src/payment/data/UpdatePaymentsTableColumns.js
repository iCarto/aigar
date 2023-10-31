import {EditableTextCellTable, LinkAccessorCellTable} from "base/table/components";
import {InvoiceStatusCellTable} from "invoice/presentational";

export function useUpdatePaymentsTableColumns(onClickViewMember, paymentType) {
    const isTimelyPayment = paymentType === "ontime";

    const tableColumns = [
        {
            Header: "Socio/a",
            accessor: invoice => `${invoice.member_id} - ${invoice.member_data.name}`,
            Cell: LinkAccessorCellTable,
            getProps: () => ({
                handleClick: onClickViewMember,
                linkAccessor: "member_id",
            }),
        },
        {
            Header: "Sector",
            accessor: "sector",
        },
        {
            Header: "Nº Factura",
            accessor: "numero",
        },
        {
            Header: "Consumo",
            accessor: "consumo",
            className: "cubic-metre bold",
        },
        isTimelyPayment
            ? {
                  Header: "Pago en plazo",
                  accessor: "ontime_payment",
                  Cell: EditableTextCellTable,
              }
            : {
                  Header: "Pago en plazo",
                  accessor: "ontime_payment",
                  className: "dollar",
              },
        !isTimelyPayment
            ? {
                  Header: "Pago con mora",
                  accessor: "late_payment",
                  Cell: EditableTextCellTable,
              }
            : {
                  Header: "Pago con mora",
                  accessor: "late_payment",
                  className: "dollar",
              },
        {
            Header: "Total factura",
            accessor: "total",
            className: "dollar bold",
        },
        {
            Header: "Estado",
            accessor: "estado",
            Cell: InvoiceStatusCellTable,
        },
        {
            Header: "Alertas",
            accessor: "errors",
            className: "text-danger small",
        },
    ];

    return {tableColumns};
}
