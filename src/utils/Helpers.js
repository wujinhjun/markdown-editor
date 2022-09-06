// // import { obj } from "./object";
// const obj = {
//     data: [
//         {
//             id: 1,
//             title: "hello-1",
//             saved: true
//         },
//         {
//             id: 2,
//             title: "hello-2",
//             saved: true
//         },
//         {
//             id: 3,
//             title: "hello-3",
//             saved: false
//         }
//     ]
// }
export const flattenArrToObj = (arrList) => {
    return arrList.reduce((result, item) => {
        result[item.id] = item;
        return result;
    }, {})
}
export const tranObjToArr = (objList) => {
    // console.log(Object.keys(objList).map((item) => (objList[item])));
    return Object.keys(objList).map((item) => (objList[item]));
}

// const a = flattenArrToObj(obj.data);
// // console.log(a);

// objToArr(a);