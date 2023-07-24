import {useState, useEffect, createContext, useContext} from "react";
import {DomainService} from "aigar/domain/service";

let DomainContext = createContext(null);

export default function DomainProvider({children}) {
    const [sectors, setSectors] = useState([]);
    const [memberTypes, setMemberTypes] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState([]);

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getInvoiceStatus(),
        ]).then(([sectors, memberTypes, invoiceStatus]) => {
            setSectors(sectors);
            setMemberTypes(memberTypes);
            setInvoiceStatus(invoiceStatus);
        });
    }, []);

    let value = {
        sectors,
        memberTypes,
        invoiceStatus,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
