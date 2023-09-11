class MemberInvoiceGroups extends Array {}

const createMemberInvoiceGroups = (data = []) => {
    const memberInvoiceGroups = MemberInvoiceGroups.from(data, memberInvoiceGroup => {
        return createMemberInvoiceGroup(memberInvoiceGroup);
    });
    return memberInvoiceGroups;
};

const createMemberInvoiceGroup = ({
    num_socio = -1,
    nombre = "",
    sector = "",
    invoices = [],
} = {}) => {
    const publicApi = {
        num_socio,
        nombre,
        sector,
        invoices,
    };

    // objeto inmutable para llevarse bien con react.
    return Object.freeze(publicApi);
};

export {createMemberInvoiceGroup as default, createMemberInvoiceGroups};
