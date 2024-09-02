import {useState} from "react";

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}

/**Using the method sortFunction, it sorts an array by attribute in descending or ascending order depending on the order "asc"/"desc" received */
function useSort(initialAttributeValue, initialOrderValue) {
    const [attribute, setAttribute] = useState(initialAttributeValue);
    const [order, setOrder] = useState(initialOrderValue);

    function sortFunction(a, b) {
        const propA = getDescendantProp(a, attribute);
        const propB = getDescendantProp(b, attribute);
        if (
            (typeof propA === "string" || propA instanceof String) &&
            (typeof propB === "string" || propB instanceof String)
        ) {
            if (order === "asc") {
                return propA.localeCompare(propB);
            }
            return propB.localeCompare(propA);
        }

        if (order === "desc") {
            if (propA > propB) {
                return -1;
            }
            if (propB < propA) {
                return 1;
            }
        } else if (order === "asc") {
            if (propA < propB) {
                return -1;
            }
            if (propB > propA) {
                return 1;
            }
        }
        return 0;
    }

    return {attribute, setAttribute, order, setOrder, sortFunction};
}

export {useSort};
