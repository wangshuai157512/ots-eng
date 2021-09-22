import * as api from '../api'
import request from '../request'


// const getTeacherList = data => {
//   return request({
//     url : api.teacherList,
//     params : data
//   })
// }

const savePhoto = data => {
  return request({
    url : api.savePhoto,
    method : 'POST',
    isUpload:true,
    data
  })
}

const getSelectPlan = data => {
  return request({
    url : api.getSelectPlan,
    method : 'POST',
    data
  })
}

const getSelectList = data => {
  return request({
    url : api.selectList,
    method : 'POST',
    data
  })
}

const queryAllSubject = data => {
  return request({
    url : api.queryAllSubject,
    method : 'POST',
    data
  })
}

const getPlanCourse = data => {
  return request({
    url : api.getPlanCourse,
    method : 'POST',
    data
  })
}

const del= data => {
  return request({
    url : api.del,
    method : 'get',
    params : data
  })
}

const registerUser = data => {
  return request({
    url : api.registerUser,
    method : 'POST',
    data
  })
}

const addStudengt = data => {
  return request({
    url : api.addStudengt,
    method : 'POST',
    data
  })
}

const planStudentImport = data => {
  return request({
    url : api.planStudentImport,
    method : 'POST',
    isUpload:true,
    data
  })
}

const studentExport = data => {
  return request({
    url : api.studentExport,
    method : 'POST',
    data
  })
}

const selectOneSignUp = data => {
  return request({
    url : api.selectOneSignUp,
    method : 'get',
    params : data
  })
}

const UpdateRegistration = data => {
  return request({
    url : api.UpdateRegistration,
    method : 'POST',
    data
  })
}

const batchImportUserPhoto = data => {
  return request({
    url : api.batchImportUserPhoto,
    method : 'POST',
    isUpload:true,
    data
  })
}

const getCurrentPlan = data => {
  return request({
    url : api.getCurrentPlan,
    method : 'POST',
    data
  })
}

const registerAgain = data => {
  return request({
    url : api.registerAgain,
    method : 'POST',
    data
  })
}


export default {
    savePhoto,
    getSelectPlan,
    getSelectList,
    queryAllSubject,
    getPlanCourse,
    del,
    registerUser,
    addStudengt,
    planStudentImport,
    studentExport,
    selectOneSignUp,
    UpdateRegistration,
    batchImportUserPhoto,
    registerAgain,
    getCurrentPlan
} 