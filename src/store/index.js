/**
 * Vuex Store状态管理
 */
import {createStore} from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
//   token: storage.getItem('token'),
  userInfo: "" ||storage.getItem('userInfo') //用户信息
}
export default createStore({
    state,
    mutations
    })