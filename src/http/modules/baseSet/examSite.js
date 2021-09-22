import request from "@/http/request"
import {
    updatePlace,
    addPlace,
    deletePlace,
    queryPlace,
    queryPlaceList,
    updatePlaceState,
    importPlace,
    queryAllPlace,
} from '@/http/api'

export const addPlaceFn = (data) => {
    return request({
        url: addPlace,
        data
    })
}
export const deletePlaceFn = (data) => {
    return request({
        url: deletePlace,
        data
    })
}
export const updatePlaceStateFn = (data) => {
    return request({
        url: updatePlaceState,
        data
    })
}
export const updatePlaceFn = (data) => {
    return request({
        url: updatePlace,
        data
    })
}
export const getSinglePlace = (data) => {
    return request({
        url: queryPlace,
        data
    })
}
export const getAllPlace = (data) => {
    return request({
        url: queryPlaceList,
        data
    })
}
export const getSelectPlace = (data = {state: 1}) => {
    return request({
        url: queryAllPlace,
        data
    })
}
export const importPlaceFn = (data) => {
    return request({
        url: importPlace,
        data,
        isUpload:true
    })
}