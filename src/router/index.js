import Vue from 'vue'
import Router from 'vue-router'
import {formatRoutes} from '@/utils/routerUtil'
import routers from './config'
import store from '@/store'

Vue.use(Router)

// 不需要登录拦截的路由配置
const loginIgnore = {
  names: ['404', '403'],      //根据路由名称匹配
  paths: ['/login'],   //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}
store.dispatch('account/getUserInfo').then(user => {
  routers.routes.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.name !== '首页' || it.name !== '编辑店铺' || it.name !== '新增店铺' || it.name !== '客户详情' || it.name !== '修改密码' || it.name !== '店铺详情') {
          if (user.data.memberType === 'front' && (it.name === '共享池' || it.name === '店铺' || it.name === '我的客户')) {
              it.meta.invisible = false
          } else if(user.data.memberType === 'admin' && (it.name === '共享池' || it.name === '店铺' || it.name === '我的客户')){
            it.meta.invisible = true
          } else if(user.data.memberType === 'admin' && (it.name === '共享池' || it.name === '店铺' || it.name === '我的客户')) {
            it.meta.invisible = true
          } else if (user.data.memberType === 'front' && it.name === '设置' && it.name === '员工管理') {
            it.meta.invisible = true
          }
        }
      })
    }
  });
})

/**
 * 初始化路由实例
 * @param isAsync 是否异步路由模式
 * @returns {VueRouter}
 */
function initRouter(isAsync) {
  const options = isAsync ? require('./async/config.async').default : require('./config').default
  formatRoutes(options.routes)
  return new Router(options)
}
export {loginIgnore, initRouter}
