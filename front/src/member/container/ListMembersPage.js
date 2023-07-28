import {useEffect, useState} from "react";

import {MemberService} from "member/service";
import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";
import {PageLayout} from "base/ui/page";
import {ListMembers} from ".";

const ListMembersPage = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();

    useEffect(() => {
        MemberService.getMembers().then(members => {
            setMembers(members);
        });
    }, []);

    useEffect(() => {
        setFilteredMembers(filterFunction(members));
    }, [members, filter]);

    const handleFilterChange = newFilter => {
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
    };

    const handleSubmitCreateMember = num_socio => {
        console.log("handleSubmitCreateMember", num_socio);
    };

    return (
        <PageLayout>
            <ListMembers
                members={filteredMembers}
                handleFilterChange={handleFilterChange}
            />
        </PageLayout>
    );
};

export default ListMembersPage;
