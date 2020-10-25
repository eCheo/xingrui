import {LOGIN, ROUTES, LOGINOUT} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    account: name,
    passWord: password,
    loginType: 'PASSWORD'
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export async function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  return request(LOGINOUT, METHOD.POST)
}
export default {
  login,
  logout,
  getRoutesConfig
}
