import request from "@/http/request"
import {
    updateStation,
    addStation,
    deleteStation,
    queryStation,
    queryStationList,
    queryAllStation,
    updateStationState,
    testLogin
} from '@/http/api'

export const login = (data) => {
    return request({
        url: testLogin,
        data
    })
}
export const addStationFn = (data) => {
    return request({
        url: addStation,
        data
    })
}
export const deleteStationFn = (data) => {
    return request({
        url: deleteStation,
        data
    })
}
export const updateStationStateFn = (data) => {
    return request({
        url: updateStationState,
        data
    })
}
export const updateStationFn = (data) => {
    return request({
        url: updateStation,
        data
    })
}
export const getSingleStation = (data) => {
    return request({
        url: queryStation,
        data
    })
}
export const getAllStation = (data) => {
    return request({
        url: queryStationList,
        data
    })
}
export const AllStation = (data = {state: 1}) => {
    return request({
        url: queryAllStation,
        data
    })
}

