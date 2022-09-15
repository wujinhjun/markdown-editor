export const flattenArrToObj = (arrList) => (
    arrList.reduce((result, item) => {
        result[item.id] = item;
        return result;
    }, {})
)
export const tranObjToArr = (objList) => Object.keys(objList).map((item) => (objList[item]))
