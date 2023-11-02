import {useFilter} from "base/filter/hooks";

function useFilterMonthlyData() {
    const {filterByTextFunction} = useFilter();

    function filterMonthlyData(items, filter) {
        return items.filter(item => {
            let filtered = true;
            if (filter.textSearch) {
                filtered = filterByTextFunction(item, filter.textSearch, [
                    "numero",
                    "num_factura",
                    "nombre",
                    "member_name",
                    "member_id",
                    "fecha",
                ]);
            }
            if (filter.showOnlyErrors) {
                filtered = filtered && item.errors.length !== 0;
            }
            return filtered;
        });
    }

    return {filterMonthlyData};
}

export {useFilterMonthlyData};
