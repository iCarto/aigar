import {useMembersTableColumns} from "../data/MembersTableColumns";

import {EntityListPage} from "base/entity/components/presentational";
import {MemberNewButton} from "member/presentational";
import {MembersFilterForm} from ".";

const ListMembers = ({members, totalMembers, handleFilterChange}) => {
    const {tableColumns} = useMembersTableColumns();

    const pageActions = [<MemberNewButton />];

    return (
        <EntityListPage
            items={members}
            totalItems={totalMembers}
            columns={tableColumns}
            selectAttribute="num_socio"
            pageActions={pageActions}
            groupActions={false}
            filterForm={<MembersFilterForm handleFilterChange={handleFilterChange} />}
        />
    );
};

export default ListMembers;
