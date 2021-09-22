import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    level: [{id: 1, name: '高起专'}, {id: 2, name: '专升本'}, {id: 3, name: '高起本'}],
    cardTypeList: [{id: 1, name: '身份证'}, {id: 2, name: '港澳台身份证'}, {id: 3, name: '士官证'}, {id: 4, name: '护照'},],
    userInfo:{},
    pageThis : null
  },
  mutations: {
    setUserInfo : (state,data) => {
      state.userInfo = data
    },
    SAVE_PAGE_THIS (state,_this) {
      state.pageThis = _this
    }
  },
  actions: {
  },
  modules: {
  }
})
