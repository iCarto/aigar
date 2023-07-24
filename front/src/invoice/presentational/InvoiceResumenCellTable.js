import React from "react";
import InvoiceStatusIcon from "./InvoiceStatusIcon";

const InvoiceResumenCellTable = ({cell}) => {
    if (cell.value) {
        return cell.value.map((estado, index) => (
            <InvoiceStatusIcon key={index} estado={estado} />
        ));
    }
    return null;
};

export default InvoiceResumenCellTable;
