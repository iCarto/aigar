import {useEffect, useState} from "react";

import {MemberService} from "member/service";
import {useList} from "base/entity/provider";
import {useFilter} from "base/filter/hooks";
import {PageLayout} from "base/ui/page";
import {Spinner} from "base/common";
import {ListMembers} from ".";

const ViewMembersPage = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(null);

    const {filter, setFilter} = useList();
    const {filterFunction} = useFilter();

    useEffect(() => {
        setIsLoading(true);
        MemberService.getMembers()
            .then(members => {
                setMembers(members);
            })
            .finally(() => setIsLoading(false));
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

    return (
        <PageLayout>
            {isLoading ? (
                <Spinner message="Cargando datos" />
            ) : (
                <ListMembers
                    members={filteredMembers}
                    totalMembers={members.length}
                    handleFilterChange={handleFilterChange}
                />
            )}
        </PageLayout>
    );
};

export default ViewMembersPage;
