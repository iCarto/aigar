import DatabaseFixture from "fixtures/database.json";
import {createMembers, members_api_adapter, createMemberMonthInfo} from "model";
import InvoiceService from "./InvoiceService";

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
        // always cast numero_socio to int
        numero_socio = parseInt(numero_socio);
        return Promise.resolve(DatabaseFixture).then(d => {
            let members = members_api_adapter(d["members"]);
            members = createMembers(members);
            return members.getSocio(numero_socio);
        });
    },

    getMembersMonthInfo(filter) {
        console.log({filter});
        const membersPromise = Promise.resolve(DatabaseFixture).then(d => {
            return createMembers(members_api_adapter(d["members"]));
        });
        const invoicesPromise = InvoiceService.getInvoices({
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
