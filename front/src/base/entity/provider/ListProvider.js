import {useState, createContext, useContext, useEffect} from "react";
import {useConfigModule} from "base/ui/module/provider";

let ListContext = createContext(null);

export default function ListProvider({children}) {
    const {moduleFilter} = useConfigModule();

    const [elements, setElements] = useState([]);
    const [view, setView] = useState("table");
    const [filter, setFilter] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);
    const [sortBy, setSortBy] = useState([]);
    const [order, setOrder] = useState("asc");

    useEffect(() => {
        setFilter({...filter, ...moduleFilter});
    }, [moduleFilter]);

    let value = {
        elements,
        setElements,
        view,
        setView,
        filter,
        setFilter,
        pageSize,
        setPageSize,
        pageIndex,
        setPageIndex,
        sortBy,
        setSortBy,
        order,
        setOrder,
    };

    console.log({elements, filter, moduleFilter, pageIndex, sortBy});

    return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

function useListView() {
    return useContext(ListContext);
}

export {useListView as useList};
