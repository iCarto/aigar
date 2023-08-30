// https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1

/*
Usage example

const dataFromMyRESTAPI = [
    {
        "foo": 4 // ignored por createMember
        "numero_socio": 34,
        "name": "Pepe Pérez",
        "sector": 4,
        "medidor": "",
        "orden": 56,
        "observaciones": "",
        "consumo_maximo": 0,
        "consumo_reduccion_fija": 0,
    },
    {
        "foo": 4 // ignored por createMember
        "numero_socio": 35,
        "name": "Juanita Pérez",
        "sector": 5,
        "medidor": "763902",
        "orden": 67,
        "observaciones": "",
        "consumo_maximo": 0,
        "consumo_reduccion_fija": 0,
    }
}
]
*/

const MEMBER_TYPES_MAPPING = {
    Activa: {
        key: "Activa",
        label: "Activo",
        icon: "fas fa-tint",
    },
    Inactiva: {
        key: "Inactiva",
        label: "Inactivo",
        icon: "fas fa-tint-slash",
    },
    con_ajuste_consumo: {
        key: "con_ajuste_consumo",
        label: "Con ajuste",
        icon: "fas fa-adjust",
    },
    Eliminada: {
        key: "Eliminada",
        label: "Eliminado",
        icon: "fas fa-solid fa-user-slash",
    },
};

const MEMBER_TYPES = {
    ACTIVE: MEMBER_TYPES_MAPPING.Activa,
    INACTIVE: MEMBER_TYPES_MAPPING.Inactiva,
    DELETED: MEMBER_TYPES_MAPPING.Eliminada,
    ADJUSTED: MEMBER_TYPES_MAPPING.con_ajuste_consumo,
};

const getTipoSocio = function (member) {
    const isActiveMember = () =>
        member.status !== MEMBER_TYPES.DELETED.label &&
        member.status !== MEMBER_TYPES.INACTIVE.label;

    const hasAdjustments = () =>
        !!member.consumo_maximo || !!member.consumo_reduccion_fija;

    if (isActiveMember() && hasAdjustments()) {
        return MEMBER_TYPES.ADJUSTED.key;
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
    /*
    Entero. Actualmente el número de socio es representado como un entero y no
    se "formatea" de otro modo (ie: "015"). Tan sólo se hace 0-pad a cuatro
    caracteres para que las facturas tengan un número uniforme de caracteres.
    Usarlo como entero facilita crear el siguiente, validación del valor, cambiar
    el formato, calcular el siguiente número. Y postponer la decisión de si es
    necesario un "id serial primary key" en la base de datos.

    El número de socio es no editable por el usuario, y se calcula automáticamente.
    El número de socio es "único", no se reutilizan números ya usados. Pero se permite
    el "traspaso". Es decir dar un "número de socio" / "derecho de consumo" a otro
    usuario. En lugar de usar el -1 podríamos hacer este método async y calcularlo a través
    de la API, pero en caso de varios usuarios podría haber problemas de concurrencia y siempre
    habría que recalcular. Sólo afecta a crear nuevo socio, es aceptable, no mostrar el nuevo
    número hasta después de "salvar"
    */
    num_socio = -1,
    /* String */
    name = "",
    /* String. Ver explicación en el modelo zone.py */
    sector = "",
    /* String */
    medidor = "",
    /* Entero. Orden del recorrido ¿ruta? sería un nombre alternativo válido */
    /* Si se mete uno nuevo por el medio mover todo el resto de rutas a mano es
    un lio */
    orden = -1,
    observaciones = "",
    consumo_maximo = null,
    consumo_reduccion_fija = null,
    status = "",
    is_active = true,
    personas_acometida = null,
    dui = "",
    tipo_uso = "",
    dia_lectura = null,
} = {}) => {
    const publicApi = {
        num_socio,
        name,
        sector,
        medidor,
        orden: parseInt(orden),
        observaciones,
        consumo_maximo: consumo_maximo === "" ? null : consumo_maximo,
        consumo_reduccion_fija:
            consumo_reduccion_fija === "" ? null : consumo_reduccion_fija,
        status,
        is_active,
        personas_acometida,
        dui,
        tipo_uso,
        dia_lectura,
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
    MEMBER_TYPES_MAPPING,
    MEMBER_TYPES,
};
