import {useMembersTableColumns} from "../data/MembersTableColumns";

import {EntityListPage} from "base/entity/components/presentational";
import {MemberNewButton} from "member/presentational";
import {MembersFilterForm} from ".";

const ListMembers = ({members, handleFilterChange}) => {
    const {tableColumns} = useMembersTableColumns();

    const pageActions = [<MemberNewButton />];

    return (
        <EntityListPage
            items={members}
            columns={tableColumns}
            pageActions={pageActions}
            groupActions={false}
            filterForm={<MembersFilterForm handleFilterChange={handleFilterChange} />}
            selectable={false}
        />
    );
};

export default ListMembers;
