import request from "@/http/request"
import {
    entrancePrint,
    selectByOne
} from '@/http/api'

export const printTicket = (data) => {
    return request({
        url: entrancePrint,
        data
    })
}
export const selectUserInfo = () => {
    return request({
        url: selectByOne,
        method: 'GET'
    })
}