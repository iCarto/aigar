import {ApiService} from "base/api/service";
import {
    createMembers,
    members_api_adapter,
    member_api_adapter,
    createMember,
} from "member/model";

const MemberService = {
    getMembers() {
        return ApiService.get("/members").then(response => {
            return createMembers(members_api_adapter(response));
        });
    },

    getMembersToExport() {
        return ApiService.get("/members/export").then(response => {
            return response;
        });
    },

    getMember(num_socio) {
        // always cast numero_socio to int
        num_socio = parseInt(num_socio);
        return ApiService.get("/members/" + num_socio + "/").then(response => {
            let member = member_api_adapter(response);
            return createMember(member);
        });
    },

    createMember(member) {
        return ApiService.post("/members/", member).then(response => {
            let member = member_api_adapter(response);
            return createMember(member);
        });
    },

    updateMember(member) {
        return ApiService.put("/members/" + member.num_socio + "/", member).then(
            response => {
                let member = member_api_adapter(response);
                return createMember(member);
            }
        );
    },

    setMemberConnected(member, connected) {
        const memberWithSoloMechaUpdated = createMember(Object.assign({}, member));
        return this.updateMember(memberWithSoloMechaUpdated);
    },

    deleteMember(member) {
        return ApiService.delete("/members/" + member.num_socio + "/").then(
            response => {
                let member = member_api_adapter(response);
                return createMember(member);
            }
        );
    },
};

export default MemberService;
