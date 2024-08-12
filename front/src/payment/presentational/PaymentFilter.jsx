import React from "react";
import {LoadDataTableFilter} from "loaddata/presentational";

export const PaymentFilter = ({filter, onChange}) => {
    return <LoadDataTableFilter filter={filter} onChange={onChange} />;
};
