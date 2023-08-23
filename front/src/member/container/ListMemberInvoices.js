import {useMemberInvoicesTableColumns} from "../data";
import {SortedPaginatedSelectableTable} from "base/table/components";

const ListMemberInvoices = ({invoices}) => {
    const {tableColumns} = useMemberInvoicesTableColumns();

    return (
        <SortedPaginatedSelectableTable
            columns={tableColumns}
            data={invoices}
            selectAttribute={"id_factura"}
        />
    );
};

export default ListMemberInvoices;
