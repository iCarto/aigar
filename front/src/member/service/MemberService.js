import {ApiService} from "base/api/service";
import {
    createMember,
    createMembers,
    member_api_adapter,
    members_api_adapter,
} from "member/model";

const MemberService = {
    getMembers() {
        return ApiService.get("/members/").then(response => {
            return createMembers(members_api_adapter(response));
        });
    },

    getMembersToExport() {
        return ApiService.get("/members/export/").then(response => {
            return response;
        });
    },

    getMember(id) {
        // always cast numero_socio to int
        id = parseInt(id);
        return ApiService.get("/members/" + id + "/").then(response => {
            let member = member_api_adapter(response);
            return createMember(member);
        });
    },

    createMember(member, selected_fee_value = 0) {
        const member_with_fee = {...member, selected_fee_value};
        return ApiService.post("/members/", member_with_fee).then(response => {
            let member = member_api_adapter(response);
            return createMember(member);
        });
    },

    updateMember(member) {
        return ApiService.put("/members/" + member.id + "/", member).then(response => {
            let member = member_api_adapter(response);
            return createMember(member);
        });
    },

    updateMemberStatus(id, status) {
        return ApiService.put("/members/status/", {
            pks: [id],
            status: status,
        }).then(response => {
            console.log(response);
        });
    },
};

export default MemberService;
