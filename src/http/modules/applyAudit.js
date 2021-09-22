import * as api from '../api'
import request from '../request'


// const getTeacherList = data => {
//   return request({
//     url : api.teacherList,
//     params : data
//   })
// }

const examineList = data => {
  return request({
    url : api.examineList,
    method : 'POST',
    data
  })
}

const examine = data => {
  return request({
    url : api.examine,
    method : 'POST',
    data
  })
}

const examineByOne = data => {
  return request({
    url : api.examineByOne,
    method : 'get',
    params : data
  })
}

const batchExamine = data => {
  return request({
    url : api.batchExamine,
    method : 'POST',
    data
  })
}



export default {
  examineList,
  examine,
  examineByOne,
  batchExamine,
} 