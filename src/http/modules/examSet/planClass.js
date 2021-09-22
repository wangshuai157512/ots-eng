import request from "@/http/request"
import {
    getClassList,
    setStudentClass,
    getClassStudentList,
    exportStudent,
    getStudentViewInfo,
    publishPlanClass,
} from '@/http/api'

export const getClassListFn = (data) => {
    return request({
        url: getClassList,
        data
    })
}

export const setStudentClassFn = (data) => {
    return request({
        url: setStudentClass,
        data
    })
}

export const getClassStudentListFn = (data) => {
    return request({
        url: getClassStudentList,
        data
    })
}

export const exportStudentFn = (data) => {
    return request({
        url: exportStudent,
        data
    })
}

export const getStudentViewInfoFn = (data) => {
    return request({
        url: getStudentViewInfo,
        data
    })
}

export const publishPlanClassFn = (data) => {
    return request({
        url: publishPlanClass,
        data
    })
}