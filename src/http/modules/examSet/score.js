import request from "@/http/request"
import {
    getPlanCoursePublish,
    publishStudentScore,
    getStudentScoreList,
    getOtsUrl,
} from '@/http/api'

export const getPlanCoursePublishFn = (data) => {
    return request({
        url: getPlanCoursePublish,
        data
    })
}

export const publishStudentScoreFn = (data) => {
    return request({
        url: publishStudentScore,
        data
    })
}

export const getStudentScoreListFn = (data) => {
    return request({
        url: getStudentScoreList,
        data
    })
}

export const getOtsUrlFn = (data) => {
    return request({
        url: getOtsUrl,
        data
    })
}