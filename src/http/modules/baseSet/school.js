import request from "@/http/request"
import {
    updateSchool,
    addSchool,
    deleteSchool,
    querySchool,
    querySchoolList,
    updateSchoolState,
    testLogin,
    queryAllSchool
} from '@/http/api'

export const login = (data) => {
    return request({
        url: testLogin,
        data
    })
}
export const addSchoolFn = (data) => {
    return request({
        url: addSchool,
        data
    })
}
export const deleteSchoolFn = (data) => {
    return request({
        url: deleteSchool,
        data
    })
}
export const updateSchoolStateFn = (data) => {
    return request({
        url: updateSchoolState,
        data
    })
}
export const updateSchoolFn = (data) => {
    return request({
        url: updateSchool,
        data
    })
}
export const getSingleSchool = (data) => {
    return request({
        url: querySchool,
        data
    })
}
export const getAllSchool = (data) => {
    return request({
        url: querySchoolList,
        data
    })
}
export const getSelectSchool = (data = {state: 1}) => {
    return request({
        url: queryAllSchool,
        data
    })
}