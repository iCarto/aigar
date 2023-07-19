import {useEffect, useState} from "react";
import {MemberService} from "service/api";
import ListMembers from "./ListMembers";
import ViewMember from "./ViewMember";
import CreateMember from "./CreateMember";
import "components/common/SideBar.css";

const ManageMembers = props => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [view, setView] = useState("list");
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

    const handleBackViewMember = () => {
        console.log("handleBackViewMember");
        setView("list");
        setSelectedMember(null);
    };

    const handleClickCreateMember = () => {
        console.log("handleSelectCreateMember");
        setView("create");
    };

    const handleSubmitCreateMember = num_socio => {
        console.log("handleSubmitCreateMember", num_socio);
        setView("view");
        setSelectedMember(num_socio);
    };

    const handleBackCreateMember = () => {
        console.log("handleBackCreateMember");
        setView("list");
        setSelectedMember(null);
    };

    if (view === "view") {
        return (
            <ViewMember
                num_socio={selectedMember}
                handleBack={handleBackViewMember}
                {...props}
            />
        );
    }
    if (view === "create") {
        return (
            <CreateMember
                handleSubmit={handleSubmitCreateMember}
                handleBack={handleBackCreateMember}
            />
        );
    }
    return (
        <ListMembers
            members={members}
            listView={listView}
            handleChangeListView={handleChangeListView}
            handleFilterChange={handleFilterChange}
            handleClickCreateMember={handleClickCreateMember}
            filter={filter}
        />
    );
};

export default ManageMembers;
