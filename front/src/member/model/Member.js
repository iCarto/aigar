// https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1

import {MEMBER_TYPES} from "member/config";

const getTipoSocio = function (member) {
    const isActiveMember = () =>
        member.status !== MEMBER_TYPES?.DELETED.label &&
        member.status !== MEMBER_TYPES?.INACTIVE.label;

    const hasAdjustments = () =>
        !!member.consumo_maximo || !!member.consumo_reduccion_fija;

    if (isActiveMember() && hasAdjustments()) {
        return MEMBER_TYPES?.ADJUSTED.key;
    } else return member.status;
};

class Members extends Array {}

const member_api_adapter = member => {
    member["medidor"] = member["medidor"] === "M" ? -1 : member["medidor"];
    member["status"] = getTipoSocio(member);
    return member;
};

const members_api_adapter = members => members.map(member_api_adapter);

const createMembers = (data = []) => {
    const members = Members.from(data, member => createMember(member));
    return members;
};

const createMember = ({
    id = -1,
    name = "",
    sector = "",
    medidor = "",
    orden = null,
    observaciones = "",
    consumo_maximo = null,
    consumo_reduccion_fija = null,
    status = "",
    personas_acometida = null,
    dui = "",
    tipo_uso = "",
} = {}) => {
    const publicApi = {
        id,
        name,
        sector,
        medidor,
        orden: orden === "" ? null : orden,
        observaciones,
        consumo_maximo: consumo_maximo === "" ? null : consumo_maximo,
        consumo_reduccion_fija:
            consumo_reduccion_fija === "" ? null : consumo_reduccion_fija,
        status,
        personas_acometida,
        dui,
        tipo_uso,

        get isDeleted() {
            return this.status === MEMBER_TYPES?.DELETED.key;
        },
    };

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

export {
    createMember as default,
    createMembers,
    member_api_adapter,
    members_api_adapter,
    getTipoSocio,
};
