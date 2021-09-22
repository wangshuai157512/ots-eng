import request from "@/http/request"
import {
    score,
    getResultList,
    certificatePrint
} from '@/http/api'

export const getScoreList = (data) => {
    return request({
        url: score,
        data
    })
}

export const exportScoreList = (data) => {
    return request({
        url: getResultList,
        data
    })
}

export const exportCertificate = (data) => {
    return request({
        url: certificatePrint,
        data
    })
}