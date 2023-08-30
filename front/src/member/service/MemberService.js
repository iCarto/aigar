import {ApiService} from "base/api/service";
import {
    createMember,
    createMembers,
    member_api_adapter,
    members_api_adapter,
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

    updateMemberStatus(num_socio, newStatus) {
        return ApiService.put("/members/" + num_socio + "/status/", newStatus).then(
            response => {
                console.log(response);
            }
        );
    },
};

export default MemberService;
