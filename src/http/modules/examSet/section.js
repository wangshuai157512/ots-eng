import request from "@/http/request"
import {
    getSessionAddName,
    addSession,
    editSession,
    deleteSession,
    getPlanSessionList,
    queryPaperByCourseCode,
    getPlanPlaceList,
    getEditSession,
} from '@/http/api'

export const getSessionName = () => {
    return request({
        url: getSessionAddName
    })
}
export const addSection = (data) => {
    return request({
        url: addSession,
        data
    })
}
export const editSection = (data) => {
    return request({
        url: editSession,
        data
    })
}
export const getSectionList = (data) => {
    return request({
        url: getPlanSessionList,
        data
    })
}
export const getPaperFn = (data) => {
    return request({
        url: queryPaperByCourseCode,
        data
    })
}
export const getPlanSite = (data) => {
    return request({
        url: getPlanPlaceList,
        data
    })
}
export const getSingleSection = (data) => {
    return request({
        url: getEditSession,
        data
    })
}
export const deleteSessionFn = (data) => {
    return request({
        url: deleteSession,
        data
    })
}