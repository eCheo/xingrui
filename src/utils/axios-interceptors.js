// import router from 'vue-router'
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 401) {
      message.error('无此接口权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.status === 403) {
      message.error(`请求被拒绝`)
    } 
    if (response.data.code === '209') {
      message.error(response.data.message);
      options.router.push('/login')
    }
    const url = options.router.history.current
    if (response.data.code === '777') {
      if (url.name !== '客户详情') {
        message.error(`您还没有添加客户【${response.data.data.name}】的跟踪信息`);
      }
      options.router.push({path: '/customerdetails'})
      return 
    }
    return response
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const {message} = options
    const {url} = config
    if (url.indexOf('login') === -1 && !sessionStorage.getItem('token')) {
      message.warning('认证 token 已过期，请重新登录')
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
}
