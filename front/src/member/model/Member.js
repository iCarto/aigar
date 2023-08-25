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

const getTipoSocio = function(member) {
    if (member.is_active === false) {
        return "eliminado";
    }
    if (
        (member.consumo_maximo && member.consumo_maximo !== 0) ||
        (member.consumo_reduccion_fija && member.consumo_reduccion_fija !== 0)
    ) {
        return "con_ajuste_consumo";
    }
    return "conectado";
};

class Members extends Array {}

const member_api_adapter = member => {
    member["medidor"] = member["medidor"] === "M" ? -1 : member["medidor"];
    member["tipo_socio"] = getTipoSocio(member);
    return member;
};

const members_api_adapter = members => members.map(member_api_adapter);

const createMembers = (data = []) => {
    const members = Members.from(data, m => createMember(m));
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
    tipo_socio = "",
    is_active = true,
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
        tipo_socio,
        is_active,
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
