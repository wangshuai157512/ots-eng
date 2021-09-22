
// 二维数组转一维数组
export const flatten = (arr) => {
    return [].concat( ...arr.map(x => Array.isArray(x) ? flatten(x) : x) )
}