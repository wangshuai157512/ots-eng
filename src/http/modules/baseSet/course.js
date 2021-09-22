import request from "@/http/request"
import {
    updateCourse,
    addCourse,
    deleteCourse,
    queryCourse,
    queryCourseList,
    updateCourseState,
    queryAllCourse,
    getPlanCourse
} from '@/http/api'

export const addCourseFn = (data) => {
    return request({
        url: addCourse,
        data
    })
}
export const deleteCourseFn = (data) => {
    return request({
        url: deleteCourse,
        data
    })
}
export const updateCourseStateFn = (data) => {
    return request({
        url: updateCourseState,
        data
    })
}
export const updateCourseFn = (data) => {
    return request({
        url: updateCourse,
        data
    })
}
export const getSingleCourse = (data) => {
    return request({
        url: queryCourse,
        data
    })
}
export const getAllCourse = (data) => {
    return request({
        url: queryCourseList,
        data
    })
}
export const getSelectCourse = (data = {state: 1}) => {
    return request({
        url: queryAllCourse,
        data
    })
}
export const getPlanCourseFn = (data) => {
    return request({
        url: getPlanCourse,
        data
    })
} 