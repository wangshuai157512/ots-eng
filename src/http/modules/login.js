import * as api from '../api'
import request from '../request'


// const getTeacherList = data => {
//   return request({
//     url : api.teacherList,
//     params : data
//   })
// }

const login = data => {
  return request({
    url : api.testLogin,
    method : 'POST',
    data
  })
}

const outLogin = data => {
  return request({
    url : api.outLogin,
    method : 'POST',
    data
  })
}

const editPsd = data => {
  return request({
    url : api.editPsd,
    method : 'POST',
    data
  })
}

const verification = data => {
  return request({
    url : api.verification,
    method : 'get',
    params : data
  })
}

const queryInfo = data => {
  return request({
    url : api.queryInfo,
    method : 'get',
    params : data
  })
}



export default {
    login,
    outLogin,
    editPsd,
    verification,
    queryInfo,
  
} 