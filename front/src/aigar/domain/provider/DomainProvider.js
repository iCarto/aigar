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
    const [aigarConfig, setAigarConfig] = useState({});

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getMemberUseTypes(),
            DomainService.getInvoiceStatus(),
            DomainService.getAigarConfig(),
        ]).then(
            ([sectors, memberTypes, memberUseTypes, invoiceStatus, aigarConfig]) => {
                setSectors(sectors.short);
                setSectorsLong(sectors.long);
                setReadingDays(sectors.readingDays);
                setMemberTypes(memberTypes);
                setMemberUseTypes(memberUseTypes);
                setInvoiceStatus(invoiceStatus);
                setAigarConfig(aigarConfig[0]);
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
        aigarConfig,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
