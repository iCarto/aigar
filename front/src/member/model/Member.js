// https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1

import WaterDropIcon from "@mui/icons-material/WaterDrop";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import RemoveIcon from "@mui/icons-material/Remove";

const MEMBER_TYPES_MAPPING = {
    Activa: {
        key: "Activa",
        label: "Activo",
        icon: <WaterDropIcon />,
    },
    Inactiva: {
        key: "Inactiva",
        label: "Inactivo",
        icon: <FormatColorResetIcon />,
    },
    con_ajuste_consumo: {
        key: "con_ajuste_consumo",
        label: "Con ajuste",
        icon: <InvertColorsIcon />,
    },
    Eliminada: {
        key: "Eliminada",
        label: "Eliminado",
        icon: <RemoveIcon />,
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
        num_socio,
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
            return this.status === MEMBER_TYPES.DELETED.key;
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
    MEMBER_TYPES,
};
