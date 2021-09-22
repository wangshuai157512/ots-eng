import request from "@/http/request"
import {
    addPlan,
    deletePlan,
    editPlan,
    editPlanState,
    getList,
    getPlan,
    getSelectPlan,
    getPlanStudent,
    getPlanCode,
    regionImport,
    deleteRegion,
    editRegion,
    getCurrentPlan,
} from '@/http/api'

export const getPagePlan = (data) => {
    return request({
        url: getList,
        data
    })
}
export const editPlanStateFn = (data) => {
    return request({
        url: editPlanState,
        data
    })
}
export const addPlanFn = (data) => {
    return request({
        url: addPlan,
        data
    })
}
export const deletePlanFn = (data) => {
    return request({
        url: deletePlan,
        data
    })
}
export const editPlanFn = (data) => {
    return request({
        url: editPlan,
        data
    })
}
export const getPlanCodeFn = () => {
    return request({
        url: getPlanCode
    })
}
export const getPlanStudentFn = (data) => {
    return request({
        url: getPlanStudent,
        data
    })
}
export const importStudent = (data) => {
    return request({
        url: regionImport,
        isUpload: true,
        data
    })
}
export const deleteStudentFn = (data) => {
    return request({
        url: deleteRegion,
        data
    })
}
export const editStudentFn = (data) => {
    return request({
        url: editRegion,
        data
    })
}
export const getSinglePlan = (data) => {
    return request({
        url: getPlan,
        data
    })
}
export const getCurrentPlanFn = () => {
    return request({
        url: getCurrentPlan,
    })
}
export const getSelectPlanFn = () => {
    return request({
        url: getSelectPlan
    })
}