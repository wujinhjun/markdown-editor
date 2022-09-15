export const flattenArrToObj = (arrList) => (
    arrList.reduce((result, item) => {
        result[item.id] = item;
        return result;
    }, {})
)

export const tranObjToArr = (objList) => Object.keys(objList).map((item) => (objList[item]))

export const getParentNode = (node, parentClassName) => {
    let current = node;
    while (current !== parentClassName) {
        if (current.classList.contains(parentClassName)) {
            return current;
        }
        current = current.parentNode;
    }

    return false;
}