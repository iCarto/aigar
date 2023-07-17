import ApiService from "./ApiService";

const DomainService = {
    getSectors() {
        return ApiService.get("/domains/sectores").then(response => {
            return response.map(domainEntity => {
                return {
                    key: domainEntity[0],
                    value: domainEntity[0] + " - " + domainEntity[1],
                };
            });
        });
    },

    getMemberTypes(showEliminado = true) {
        let memberTypes = [
            {key: "conectado", value: "Conectado"},
            {key: "solo_mecha", value: "Solo mecha"},
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
