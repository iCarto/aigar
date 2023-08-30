import {useList} from "base/entity/provider";

function useFilter() {
    const {filter} = useList();

    function filterFunction(items) {
        if (filter) {
            const filteredItems = items.filter(item => {
                return Object.entries(filter).every(([key, value]) => {
                    // TO-DO: Bootstrapped code
                    if (key === "nombre" || key === "name") {
                        return (
                            item.hasOwnProperty(key) &&
                            item[key]
                                .toString()
                                .toLowerCase()
                                .includes(value.toString().toLowerCase())
                        );
                    } else {
                        return (
                            item.hasOwnProperty(key) &&
                            item[key].toString().toLowerCase() ===
                                value.toString().toLowerCase()
                        );
                    }
                });
            });

            return filteredItems;
        }
        return {};
    }

    function filterByTextFunction(item, filterText, searchProperties) {
        return searchProperties.some(property => {
            const value = String(item[property]).toLowerCase();
            const searchText = filterText.toLowerCase();

            return value.indexOf(searchText) >= 0;
        });
    }

    return {filterFunction, filterByTextFunction};
}

export {useFilter};
