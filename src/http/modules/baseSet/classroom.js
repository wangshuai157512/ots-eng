import request from "@/http/request"
import {
    updateClass,
    addClass,
    deleteClass,
    queryClass,
    queryClassList,
    updateClassState,
    importClass,
} from '@/http/api'

export const addClassFn = (data) => {
    return request({
        url: addClass,
        data
    })
}
export const deleteClassFn = (data) => {
    return request({
        url: deleteClass,
        data
    })
}
export const updateClassStateFn = (data) => {
    return request({
        url: updateClassState,
        data
    })
}
export const updateClassFn = (data) => {
    return request({
        url: updateClass,
        data
    })
}
export const getSingleClass = (data) => {
    return request({
        url: queryClass,
        data
    })
}
export const getAllClass = (data) => {
    return request({
        url: queryClassList,
        data
    })
}
export const importClassFn = (data) => {
    return request({
        url: importClass,
        data,
        isUpload:true
    })
}