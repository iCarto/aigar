import {ApiService} from "base/api/service";
import {USE_TYPES_MAPPING} from "member/data";
import {MEMBER_TYPES} from "member/model";

const DomainService = {
    getSectors() {
        return ApiService.get("/domains/zones/").then(response => {
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
            {
                key: MEMBER_TYPES.ACTIVE.key,
                value: MEMBER_TYPES.ACTIVE.label,
            },
            {
                key: MEMBER_TYPES.INACTIVE.key,
                value: MEMBER_TYPES.INACTIVE.label,
            },
            {
                key: MEMBER_TYPES.ADJUSTED.key,
                value: MEMBER_TYPES.ADJUSTED.label,
            },
        ];
        if (showEliminado) {
            memberTypes.push({
                key: MEMBER_TYPES.DELETED.key,
                value: MEMBER_TYPES.DELETED.label,
            });
        }
        return Promise.resolve(memberTypes);
    },

    getInvoiceStatus() {
        return ApiService.get("/domains/estados/").then(response => {
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
