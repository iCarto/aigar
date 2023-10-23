import {useList} from "base/entity/provider";

function useFilter() {
    const {filter} = useList();

    // TODO: Bootstrapped code
    const textFilters = ["nombre", "name", "numero"];
    const combinedFilters = [
        {
            filter: "socio_factura",
            searchedProperties: ["nombre", "member_id"],
        },
        {
            filter: "socio",
            searchedProperties: ["name", "id"],
        },
    ];

    const filterFunction = items => {
        if (!filter) return items;

        return items.filter(item =>
            Object.entries(filter).every(([key, value]) => {
                const filterValue = normalizeText(value?.toString());

                if (isCombinedFilter(key)) {
                    return matchesCombinedFilter(key, item, filterValue);
                } else {
                    if (key === "startInvoicingMonth") {
                        return parseInt(item.mes_facturacion) >= parseInt(value);
                    }
                    if (key === "endInvoicingMonth") {
                        return parseInt(item.mes_facturacion) <= parseInt(value);
                    }
                    if (item.member_data.sector && key === "sector") {
                        return item.member_data.sector === value;
                    } else {
                        const itemValue = getItemValue(item, key);

                        if (textFilters.includes(key)) {
                            return matchesTextSearch(itemValue, filterValue);
                        }

                        return itemValue === filterValue;
                    }
                }
            })
        );
    };

    const getItemValue = (item, key) => {
        return normalizeText(item[key]?.toString());
    };

    const getCombinedFilter = key => {
        return combinedFilters.find(combinedFilter => combinedFilter.filter === key);
    };

    function isCombinedFilter(key) {
        return !!getCombinedFilter(key);
    }

    const matchesCombinedFilter = (key, searchedObject, searchValue) => {
        const combinedFilter = getCombinedFilter(key);

        if (isNaN(searchValue)) {
            return combinedFilter.searchedProperties.some(property => {
                const itemValue = getItemValue(searchedObject, property);
                return matchesTextSearch(itemValue, searchValue);
            });
        } else {
            return combinedFilter.searchedProperties.some(
                property => getItemValue(searchedObject, property) === searchValue
            );
        }
    };

    const matchesTextSearch = (searchedObject, searchValue) => {
        return searchedObject.includes(searchValue);
    };

    const normalizeText = text => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
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
