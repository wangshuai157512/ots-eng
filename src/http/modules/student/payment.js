import request from "@/http/request"
import {
    selectPayInfo,
    cashierInfo
} from '@/http/api'

export const selectPayInfoFn = (data) => {
    return request({
        url: selectPayInfo,
        data
    })
}

export const payFn = (data) => {
    return request({
        url: cashierInfo,
        data
    })
}