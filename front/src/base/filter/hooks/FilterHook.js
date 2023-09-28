import {useList} from "base/entity/provider";

function useFilter() {
    const {filter} = useList();

    const filterFunction = items => {
        if (!filter) return {};

        const normalizeText = text => {
            return text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
        };

        return items.filter(item =>
            Object.entries(filter).every(([key, value]) => {
                const itemValue = normalizeText(item[key]?.toString());
                const filterValue = normalizeText(value?.toString());

                return (
                    item.hasOwnProperty(key) &&
                    (["nombre", "name", "numero"].includes(key)
                        ? itemValue.includes(filterValue)
                        : itemValue === filterValue)
                );
            })
        );
    };

    const filterByTextFunction = (item, filterText, searchProperties) => {
        return searchProperties.some(property => {
            const value = String(item[property]).toLowerCase();
            const searchText = filterText.toLowerCase();

            return value.indexOf(searchText) >= 0;
        });
    };

    return {filterFunction, filterByTextFunction};
}

export {useFilter};
