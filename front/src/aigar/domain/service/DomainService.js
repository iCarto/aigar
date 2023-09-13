import {ApiService} from "base/api/service";
import {USE_TYPES_MAPPING} from "member/data";

const DomainService = {
    getSectors() {
        return ApiService.get("/domains/zones").then(response => {
            const shortNames = response.map(domainEntity => ({
                value: domainEntity.name,
                dia_lectura: domainEntity.measuring_day,
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

    getMemberUseTypes() {
        const memberUseTypes = Object.keys(USE_TYPES_MAPPING).map(key => ({
            key,
            value: USE_TYPES_MAPPING[key].label,
        }));
        return Promise.resolve(memberUseTypes);
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
