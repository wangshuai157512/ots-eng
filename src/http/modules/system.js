import * as api from '../api'
import request from '../request'


const getConfigData = data => {
  return request({
    url : api.getConfigData,
    method : 'POST',
    data
  })
}

const addConfig = data => {
  return request({
    url : api.addConfig,
    method : 'POST',
    data
  })
}

const systemM = data => {
	return request({
	  url : api.execute,
	  method : 'POST',
	  data
	})
}

export default {
    getConfigData,
    addConfig,
	  systemM
} 