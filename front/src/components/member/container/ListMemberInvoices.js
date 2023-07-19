import {useMemberInvoicesTableColumns} from "../data";
import {EntityList} from "base/entity/components/presentational";

const ListMemberInvoices = ({invoices}) => {
    const {tableColumns} = useMemberInvoicesTableColumns();

    // TO-DO: HANDLE THIS (PROBABLY BEST IN PARENT COMPONENT)
    const listView = {
        sortBy: [],
        pageIndex: 0,
    };

    return (
        <EntityList
            items={invoices}
            columns={tableColumns}
            listView={listView}
            handleChangeListView={undefined}
        />
    );
};

export default ListMemberInvoices;
