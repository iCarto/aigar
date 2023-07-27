import {useMemberInvoicesTableColumns} from "../data";
import {SortedPaginatedTable} from "base/table";

const ListMemberInvoices = ({invoices}) => {
    const {tableColumns} = useMemberInvoicesTableColumns();

    return <SortedPaginatedTable columns={tableColumns} data={invoices} />;
};

export default ListMemberInvoices;
