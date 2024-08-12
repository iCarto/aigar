import {LoadDataTable} from "loaddata/presentational";
import {useLoadPaymentsTableColumns} from "payment/data";

export const PaymentTable = ({payments, onUpdatePayment, onViewMember}) => {
    const {tableColumns} = useLoadPaymentsTableColumns(onViewMember);

    return (
        <LoadDataTable
            items={payments}
            columns={tableColumns}
            onUpdateData={onUpdatePayment}
        />
    );
};
