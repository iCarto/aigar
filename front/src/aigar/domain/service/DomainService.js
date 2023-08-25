import {ApiService} from "base/api/service";

const DomainService = {
    getSectors() {
        return ApiService.get("/domains/zones").then(response => {
            const shortNames = response.map(domainEntity => ({
                value: domainEntity.name,
            }));
            const longNames = response.map(domainEntity => ({
                value: domainEntity.long_name,
            }));
            return {
                short: shortNames,
                long: longNames,
            };
        });
    },

    getMemberTypes(showEliminado = true) {
        let memberTypes = [
            {key: "conectado", value: "Conectado"},
            {key: "con_ajuste_consumo", value: "Con ajuste"},
        ];
        if (showEliminado) {
            memberTypes.push({key: "eliminado", value: "Eliminado"});
        }
        return Promise.resolve(memberTypes);
    },

    getInvoiceStatus() {
        return ApiService.get("/domains/estados").then(response => {
            return response.map(domainEntity => {
                return {
                    key: domainEntity[0],
                    value: domainEntity[1],
                };
            });
        });
    },
};

export default DomainService;
