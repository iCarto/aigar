// https://medium.com/javascript-scene/javascript-factory-functions-with-es6-4d224591a8b1

const SECTORES_COMUNIDADES = {
    "0": "",
    "1": "TIHUAPA NORTE",
    "2": "TIHUAPA NORTE",
    "3": "TIHUAPA NORTE",
    "4": "TIHUAPA NORTE",
    "5": "TLACUXTLI",
    "6": "TLACUXTLI",
    "7": "TLACUXTLI",
};
/*
Usage example

const dataFromMyRESTAPI = [
    {
        "foo": 4 // ignored por createMember
        "numero_socio": 34,
        "name": "Pepe Pérez",
        "sector": 4,
        "medidor": "",
        "solo_mecha": false,
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
        "solo_mecha": false,
        "orden": 67,
        "observaciones": "",
        "consumo_maximo": 0,
        "consumo_reduccion_fija": 0,
    }
}
]

*/

class Members extends Array {
    getSocio(num_socio) {
        const members = this.filter(m => m["num_socio"] === num_socio);
        if (members.length === 1) {
            return members[0];
        }
        throw new Error("No hay socios con ese número");
    }
}

const member_api_adapter = m => {
    m["num_socio"] = parseInt(m["numero_socio"]);
    m["name"] = m["nombre"];
    m["observaciones"] = `${m["observaciones_1"] || ""} ${m["observaciones_2"] ||
        ""}`.trim();
    m["solo_mecha"] = m["medidor"] === "M" ? true : false;
    m["medidor"] = m["medidor"] === "M" ? -1 : m["medidor"];
    m["orden"] = m["ruta"] ? m["ruta"] : -1;
    // delete m["numero_socio"];
    return m;
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
    /* Entero. Mismo razonamiento que para `num_socio` */
    sector = 0,
    /* String */
    medidor = "",
    /* El socio dispone de conexión pero no consume agua */
    solo_mecha = false,
    /* Entero. Orden del recorrido ¿ruta? sería un nombre alternativo válido */
    /* Si se mete uno nuevo por el medio mover todo el resto de rutas a mano es
    un lio */
    orden = -1,
    observaciones = "",

    consumo_maximo = 0,
    consumo_reduccion_fija = 0,
} = {}) => {
    const publicApi = {
        num_socio,
        name,
        sector,
        medidor,
        solo_mecha,
        orden,
        observaciones,
        consumo_maximo,
        consumo_reduccion_fija,
        // comunidad: SECTORES_COMUNIDADES[this.sector],
    };

    // Un "getter" es enumerable en un object literal. Definirlo así permite
    // jugar con esto y tenenerlo en JSON.stringify(myobj) o no
    /*
    Object.defineProperty(publicApi, "comunidad", {
        get: () => SECTORES_COMUNIDADES[this.sector],
        enumerable: false,
    });
    */
    // Pero si ya no va a ser writable podemos fijar el valor directamente.
    Object.defineProperty(publicApi, "comunidad", {
        value: SECTORES_COMUNIDADES[sector],
        enumerable: true, // valor por defecto pero interesa ser explicito
    });

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

export {createMember as default, createMembers, members_api_adapter};
