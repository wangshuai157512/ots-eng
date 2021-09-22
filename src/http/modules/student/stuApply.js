import * as api from '../../api'
import request from '../../request'


const selectByOne = data => {
  return request({
    url : api.selectByOne,
    method : 'GET',
    params : data
  })
}

// const add = data => {
//   return request({
//     url : api.add,
//     method : 'POST',
//     data
//   })
// }




export default {
   selectByOne,
} 