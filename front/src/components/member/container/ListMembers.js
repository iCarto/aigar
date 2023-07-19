import {useEffect, useState} from "react";
import {useMembersTableColumns} from "../data/MembersTableColumns";
import ListMembersSidebar from "./ListMembersSidebar";
import {EntityList} from "base/entity/components/presentational";
import "components/common/SideBar.css";

const ListMembers = ({
    members,
    listView,
    handleChangeListView,
    handleFilterChange,
    handleClickCreateMember,
    filter,
}) => {
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

    const sidebar = (
        <ListMembersSidebar
            handleFilterChange={handleFilterChange}
            handleClickCreateMember={handleClickCreateMember}
            filter={filter}
        />
    );

    return (
        <div className="h-100">
            <div className="row no-gutters h-100">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    {sidebar}
                </nav>
                <div className="col-md-10 offset-md-2">
                    <div className="container">
                        <EntityList
                            items={filteredMembers}
                            columns={tableColumns}
                            listView={listView}
                            handleChangeListView={handleChangeListView}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListMembers;
