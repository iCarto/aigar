import {useList} from "base/entity/provider";

function useFilter() {
    const {filter} = useList();

    function filterFunction(items) {
        if (filter) {
            const filteredItems = items.filter(item => {
                return Object.entries(filter).every(([key, value]) => {
                    return (
                        item.hasOwnProperty(key) &&
                        item[key]
                            .toString()
                            .toLowerCase()
                            .includes(value.toString().toLowerCase())
                    );
                });
            });

            return filteredItems;
        }
        return {};
    }

    return {filterFunction};
}

export {useFilter};
