import * as api from '../../api'
import request from '../../request'

const examineByOne = data => {
  return request({
    url : api.examineByOne,
    method : 'GET',
    params : data
  })
}

export default {
  examineByOne
}
