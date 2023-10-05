import {useFilter} from "base/filter/hooks";

function useFilterMonthlyData() {
    const {filterByTextFunction} = useFilter();

    function filterMonthlyData(items, filter) {
        return items.filter(item => {
            let filtered = true;
            if (filter.text) {
                filtered = filterByTextFunction(item, filter.text, [
                    "numero",
                    "member_id",
                    "nombre",
                    "member_name",
                    "num_factura",
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
