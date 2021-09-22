import request from '@/http/request'
import {
    updateInfo
} from '@/http/api'

export const updateInfoFn = (data) => {
    return request({
        url: updateInfo,
        data
    })
}