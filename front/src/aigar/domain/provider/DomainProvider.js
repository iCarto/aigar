import {useState, useEffect, createContext, useContext} from "react";
import {DomainService} from "aigar/domain/service";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {useInvoicingMonths} from "monthlyinvoicing/hooks";

let DomainContext = createContext(null);

export default function DomainProvider({children}) {
    const [sectors, setSectors] = useState([]);
    const [sectorsLong, setSectorsLong] = useState([]);
    const [readingDays, setReadingDays] = useState([]);
    const [memberTypes, setMemberTypes] = useState([]);
    const [memberUseTypes, setMemberUseTypes] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [basicConfig, setBasicConfig] = useState([]);
    const [invoicingMonths, setInvoicingMonths] = useState([]);
    const [currentInvoicingMonth, setCurrentInvoicingMonth] = useState({});

    const {sortInvoicingMonths, getCurrentInvoicingMonth} = useInvoicingMonths();

    useEffect(() => {
        Promise.all([
            DomainService.getSectors(),
            DomainService.getMemberTypes(),
            DomainService.getMemberUseTypes(),
            DomainService.getInvoiceStatus(),
            DomainService.getBasicConfig(),
            InvoicingMonthService.getInvoicingMonths(),
        ]).then(
            ([
                sectors,
                memberTypes,
                memberUseTypes,
                invoiceStatus,
                basicConfig,
                invoicingMonths,
            ]) => {
                setSectors(sectors.short);
                setSectorsLong(sectors.long);
                setReadingDays(sectors.readingDays);
                setMemberTypes(memberTypes);
                setMemberUseTypes(memberUseTypes);
                setInvoiceStatus(invoiceStatus);
                setBasicConfig(basicConfig);
                setInvoicingMonths(sortInvoicingMonths(invoicingMonths));
                setCurrentInvoicingMonth(getCurrentInvoicingMonth(invoicingMonths));
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
        invoicingMonths,
        currentInvoicingMonth,
    };

    return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}

function useDomain() {
    return useContext(DomainContext);
}

export {useDomain};
