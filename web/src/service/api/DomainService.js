const DomainService = {
    getSectors() {
        return Promise.resolve([
            {key: 1, value: "1 - TIHUAPA NORTE"},
            {key: 2, value: "2 - TIHUAPA NORTE"},
            {key: 3, value: "3 - TIHUAPA NORTE"},
            {key: 4, value: "4 - TIHUAPA NORTE"},
            {key: 5, value: "5 - TLACUXTLI"},
            {key: 6, value: "6 - TLACUXTLI"},
            {key: 7, value: "7 - TLACUXTLI"},
        ]);
    },
    getMemberTypes() {
        return Promise.resolve([
            {key: "activo", value: "Mecha activa"},
            {key: "inactivo", value: "Mecha inactiva"},
            {key: "desconectado", value: "Desconectado"},
        ]);
    },
    getInvoiceStatus() {
        return Promise.resolve([
            {key: "pendiente", value: "Pendiente de cobro"},
            {key: "cobrado", value: "Cobrado"},
            {key: "mora", value: "Mora"},
        ]);
    },
};

export default DomainService;
