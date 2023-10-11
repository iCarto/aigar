import {useState, useEffect, createContext, useContext} from "react";
import {DomainService} from "aigar/domain/service";

let DomainContext = createContext(null);

export default function DomainProvider({children}) {
    const [sectors, setSectors] = useState([]);
    const [sectorsLong, setSectorsLong] = useState([]);
    const [readingDays, setReadingDays] = useState([]);
    const [memberTypes, setMemberTypes] = useState([]);
    const [memberUseTypes, setMemberUseTypes] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [basicConfig, setBasicConfig] = useState([]);

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getMemberUseTypes(),
            DomainService.getInvoiceStatus(),
            DomainService.getBasicConfig(),
        ]).then(
            ([sectors, memberTypes, memberUseTypes, invoiceStatus, basicConfig]) => {
                setSectors(sectors.short);
                setSectorsLong(sectors.long);
                setReadingDays(sectors.readingDays);
                setMemberTypes(memberTypes);
                setMemberUseTypes(memberUseTypes);
                setInvoiceStatus(invoiceStatus);
                setBasicConfig(basicConfig);
            }
        );
    }, []);

    let value = {
        sectors,
        sectorsLong,
        readingDays,
        memberTypes,
        memberUseTypes,
        invoiceStatus,
        basicConfig,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
