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

    getMemberTypes() {
        return Promise.resolve([
            {key: "normal", value: "Normal"},
            {key: "con_mecha", value: "Con mecha"},
            {key: "con_ajuste_consumo", value: "Ajuste de consumo"},
            {key: "eliminado", value: "Eliminado"},
        ]);
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
