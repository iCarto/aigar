import React from "react";
import {DateUtil} from "components/util";

const InvoiceMonthCellTable = ({row}) => {
    return (
        <div className="text-nowrap">
            {DateUtil.getMonthName(row.original.mes_facturado)} - {row.original.anho}
        </div>
    );
};

export default InvoiceMonthCellTable;
