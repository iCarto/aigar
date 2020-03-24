import DatabaseFixture from "fixtures/database.json";
import {
    createMember,
    member_api_adapter,
    createMembers,
    members_api_adapter,
    createMemberMonthInfo,
} from "model";
import InvoiceServiceOld from "./InvoiceService_old";
import ApiService from "./ApiService";

const MemberService = {
    getMembers() {
        return ApiService.get("/members").then(response => {
            return createMembers(members_api_adapter(response));
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
        const memberWithSoloMechaUpdated = createMember(
            Object.assign({}, member, {solo_mecha: connected})
        );
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

    getMembersMonthInfo(filter) {
        console.log({filter});
        const membersPromise = Promise.resolve(DatabaseFixture).then(d => {
            return createMembers(members_api_adapter(d["members"]));
        });
        const invoicesPromise = InvoiceServiceOld.getInvoices({
            year: filter.year,
            month: filter.month,
        });
        return Promise.all([membersPromise, invoicesPromise]).then(values => {
            let members = values[0];
            let invoices = values[1];
            return members
                .map(member => {
                    const memberInvoice = invoices.find(invoice => {
                        return parseInt(invoice.numero_socio) === member.num_socio;
                    });
                    return createMemberMonthInfo({
                        num_socio: member.num_socio,
                        num_factura: memberInvoice ? memberInvoice.numero : null,
                        nombre_socio: member.name,
                        sector_socio: member.sector,
                        lectura: memberInvoice ? memberInvoice.consumo : null,
                        importe: memberInvoice ? memberInvoice.total : null,
                        resumen_3_meses: [],
                    });
                })
                .filter(memberMonthInfo => {
                    var filtered = true;
                    if (filter) {
                        if (filter.nombre) {
                            filtered =
                                filtered &&
                                memberMonthInfo.nombre_socio.indexOf(filter.nombre) >=
                                    0;
                        }
                        if (filter.sector) {
                            filtered =
                                filtered &&
                                memberMonthInfo.sector_socio ===
                                    parseInt(filter.sector);
                        }
                        if (filter.tipo_socio) {
                            filtered =
                                filtered &&
                                memberMonthInfo.tipo_socio === filter.tipo_socio;
                        }
                        if (filter.estado) {
                            filtered =
                                filtered && memberMonthInfo.estado === filter.estado;
                        }
                    }
                    return filtered;
                });
        });
    },
};

export default MemberService;
