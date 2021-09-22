import request from "@/http/request"
import {
    updateSubject,
    addSubject,
    deleteSubject,
    querySubject,
    querySubjectList,
    updateSubjectState,
    importSubject,
    queryAllSubject,
} from '@/http/api'

export const addSubjectFn = (data) => {
    return request({
        url: addSubject,
        data
    })
}
export const deleteSubjectFn = (data) => {
    return request({
        url: deleteSubject,
        data
    })
}
export const updateSubjectStateFn = (data) => {
    return request({
        url: updateSubjectState,
        data
    })
}
export const updateSubjectFn = (data) => {
    return request({
        url: updateSubject,
        data
    })
}
export const getSingleSubject = (data) => {
    return request({
        url: querySubject,
        data
    })
}
export const getAllSubject = (data) => {
    return request({
        url: querySubjectList,
        data
    })
}
export const importSubjectFn = (data) => {
    return request({
        url: importSubject,
        data,
        isUpload:true
    })
}
export const getSelectSubject = (data = {state: 1}) => {
    return request({
        url: queryAllSubject,
        data
    })
}