class MembersMonthInfo extends Array {
    getSocio(num_socio) {
        const members = this.filter(m => m["num_socio"] === num_socio);
        if (members.length === 1) {
            return members[0];
        }
        throw new Error("No hay socios con ese número");
    }
}

const createMembersMonthInfo = (data = []) => {
    const membersMonthInfo = MembersMonthInfo.from(data, m => createMemberMonthInfo(m));
    return membersMonthInfo;
};

const createMemberMonthInfo = ({
    num_socio = null,
    num_factura = null,
    nombre_socio = null,
    sector_socio = null,
    tipo_socio = "activo",
    lectura = null,
    importe = null,
    estado = "pendiente",
    resumen_3_meses = [],
} = {}) => {
    const publicApi = {
        num_socio,
        num_factura,
        nombre_socio,
        sector_socio,
        tipo_socio,
        lectura,
        importe,
        estado,
        resumen_3_meses,
    };

    return Object.freeze(publicApi);
};

export {createMemberMonthInfo as default, createMembersMonthInfo};
