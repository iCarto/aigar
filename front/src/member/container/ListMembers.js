import {useEffect, useState} from "react";
import {useMembersTableColumns} from "../data/MembersTableColumns";

import {MembersFilterForm} from ".";
import {MemberNewButton} from "member/presentational";
import {EntityListPage} from "base/entity/components/presentational";

const ListMembers = ({members, handleFilterChange, filter}) => {
    const [filteredMembers, setFilteredMembers] = useState([]);
    const {tableColumns} = useMembersTableColumns();

    useEffect(() => {
        setFilteredMembers(filterMembers(members, filter));
    }, [members, filter]);

    const filterMembers = (members, filter) => {
        return members.filter(member => {
            var filtered = true;
            if (filter) {
                if (filter.name) {
                    filtered =
                        member.name.toLowerCase().indexOf(filter.name.toLowerCase()) >=
                        0;
                }
                if (filter.num_socio) {
                    filtered =
                        member.num_socio
                            .toString()
                            .indexOf(filter.num_socio.toString()) >= 0;
                }
                if (filter.sector) {
                    filtered = filtered && member.sector === parseInt(filter.sector);
                }
                if (filter.tipo_socio) {
                    filtered = filtered && member.tipo_socio === filter.tipo_socio;
                }
            }
            return filtered;
        });
    };

    const pageActions = [<MemberNewButton />];

    return (
        <EntityListPage
            items={filteredMembers}
            columns={tableColumns}
            pageActions={pageActions}
            groupActions={false}
            filterForm={
                <MembersFilterForm
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
            }
        />
    );
};

export default ListMembers;
