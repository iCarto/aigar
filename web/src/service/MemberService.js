import DatabaseFixture from "fixtures/database.json";
import {createMembers, members_api_adapter} from "model";

const MemberService = {
    getMembers(filter) {
        return Promise.resolve(DatabaseFixture).then(d => {
            const members = createMembers(members_api_adapter(d["members"]));
            return members.filter(member => {
                var filtered = true;
                if (filter) {
                    if (filter.name) {
                        filtered = member.name.indexOf(filter.name) >= 0;
                    }
                    if (filter.sector) {
                        filtered = member.sector === parseInt(filter.sector);
                    }
                }
                return filtered;
            });
        });
    },
    getMember(numero_socio) {
        return Promise.resolve(DatabaseFixture).then(d => {
            let members = members_api_adapter(d["members"]);
            members = createMembers(members);
            return members.getSocio(numero_socio);
        });
    },
};

export default MemberService;
