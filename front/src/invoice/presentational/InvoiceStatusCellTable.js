import React from "react";
import InvoiceStatusLabel from "./InvoiceStatusLabel";

const InvoiceStatusCellTable = ({cell}) => {
    return <InvoiceStatusLabel estado={cell.value} />;
};

export default InvoiceStatusCellTable;
