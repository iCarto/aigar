import {useMemberInvoicesTableColumns} from "../data";
import {SortedPaginatedTable} from "base/table";

const ListMemberInvoices = ({invoices}) => {
    const {tableColumns} = useMemberInvoicesTableColumns();

    // TO-DO: HANDLE THIS (PROBABLY BEST IN PARENT COMPONENT)
    const listView = {
        sortBy: [],
        pageIndex: 0,
    };

    return (
        <SortedPaginatedTable
            columns={tableColumns}
            data={invoices}
            listView={listView}
        />
    );
};

export default ListMemberInvoices;
