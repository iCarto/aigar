import {useEffect, useState} from "react";
import {MemberService} from "member/service";

import {useList} from "base/entity/provider";
import {PageLayout} from "base/ui/page";
import {ListMembers} from ".";

const ListMembersPage = () => {
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState({
        name: "",
        num_socio: "",
        sector: 0,
        tipo_socio: "",
    });

    const {pageIndex, pageSize, orderBy} = useList();

    console.log({pageIndex, pageSize, orderBy});

    useEffect(() => {
        MemberService.getMembers().then(members => {
            setMembers(members);
        });
    }, []);

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
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
                members={members}
                handleFilterChange={handleFilterChange}
                filter={filter}
            />
        </PageLayout>
    );
};

export default ListMembersPage;
