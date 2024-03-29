import {useState, useEffect, createContext, useContext} from "react";
import {MemberService} from "member/service";

let MembersListContext = createContext(null);

export default function MemberSortedListProvider({children}) {
    const [sortedMembersList, setSortedMembersList] = useState([]);

    useEffect(() => {
        fetchMembersList();
    }, []);

    const fetchMembersList = () => {
        MemberService.getMembers().then(members => {
            const sortedList = sortMembers(members);
            setSortedMembersList(sortedList);
        });
    };

    const sortMembers = members => {
        let membersWithOrder = members
            .filter(member => !member.isDeleted)
            .map(member => {
                return {
                    id: member.id,
                    order: member.orden,
                    name: member.name,
                };
            });
        membersWithOrder.sort((a, b) => {
            return a.order - b.order;
        });
        return membersWithOrder;
    };

    let value = {
        sortedMembersList,
        setSortedMembersList,
        sortMembers,
        fetchMembersList,
    };

    return (
        <MembersListContext.Provider value={value}>
            {children}
        </MembersListContext.Provider>
    );
}

function useMembersList() {
    return useContext(MembersListContext);
}

export {useMembersList};
