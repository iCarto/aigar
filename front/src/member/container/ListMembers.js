import {useState} from "react";
import {useMembersTableColumns} from "../data/MembersTableColumns";

import {EntityListPage} from "base/entity/components/presentational";
import {MemberNewButton} from "member/presentational";
import {MembersFilterForm} from ".";

const ListMembers = ({members, handleFilterChange}) => {
    const [selectedTableRows, setSelectedTableRows] = useState([]);
    const {tableColumns} = useMembersTableColumns();

    const handleClickOnTableRows = selectedItems => {
        setSelectedTableRows(selectedItems);
    };

    const pageActions = [<MemberNewButton />];

    return (
        <EntityListPage
            items={members}
            columns={tableColumns}
            selectAttribute="num_socio"
            pageActions={pageActions}
            groupActions={false}
            filterForm={<MembersFilterForm handleFilterChange={handleFilterChange} />}
            onClickRows={handleClickOnTableRows}
            selectedTableRows={selectedTableRows}
        />
    );
};

export default ListMembers;
