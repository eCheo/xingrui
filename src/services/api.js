//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const BASE_UT = 'http://47.108.133.94:8089'
module.exports = {
  LOGIN: `${BASE_UT}/api/login/login.json`,
  ROUTES: `${BASE_URL}/routes`,
  GOODS: `${BASE_URL}/goods`,
  LOGINOUT: `${BASE_UT}/api/login/loginOut.json`
}
