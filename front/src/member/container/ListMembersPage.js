import {useEffect, useState} from "react";
import {MemberService} from "member/service";
import ListMembers from "./ListMembers";

const ListMembersPage = () => {
    const [members, setMembers] = useState([]);
    const [listView, setListView] = useState({
        sortBy: [],
        pageIndex: 0,
    });
    const [filter, setFilter] = useState({
        name: "",
        num_socio: "",
        sector: 0,
        tipo_socio: "",
    });

    useEffect(() => {
        MemberService.getMembers().then(members => {
            setMembers(members);
        });
    }, []);

    const handleChangeListView = listView => {
        console.log("handleChangeListView", {listData: listView});
        setListView(listView);
    };

    const handleFilterChange = newFilter => {
        console.log("handleFilterChange", newFilter);
        setFilter(prevFilter => ({
            ...prevFilter,
            ...newFilter,
        }));
        setListView(prevListView => ({
            ...prevListView,
            pageIndex: 0,
        }));
    };

    const handleSubmitCreateMember = num_socio => {
        console.log("handleSubmitCreateMember", num_socio);
    };

    return (
        <ListMembers
            members={members}
            listView={listView}
            handleChangeListView={handleChangeListView}
            handleFilterChange={handleFilterChange}
            filter={filter}
        />
    );
};

export default ListMembersPage;
