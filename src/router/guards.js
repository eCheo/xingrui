import {hasAuthority} from '@/utils/authority-utils'
import {loginIgnore} from '@/router/index'
import {checkAuthorization} from '@/utils/request'
import NProgress from 'nprogress'
import routers from './config'
import store from '@/store'

NProgress.configure({ showSpinner: false })

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  // start progress bar
  // store.dispatch('account/getUserInfo')
  if (!NProgress.isStarted()) {
    NProgress.start()
  }
  next()
}

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next) => {
  // const {message} = options
  if (!loginIgnore.includes(to) && !checkAuthorization()) {
    // message.warning('登录已失效，请重新登录')
    next({path: '/login'})
  } else {
    next()
  }
}

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  const {store, message} = options
  const permissions = store.getters['account/permissions']
  const roles = store.getters['account/roles']
  if (!hasAuthority(to, permissions, roles)) {
    message.warning(`对不起，您无权访问页面: ${to.fullPath}，请联系管理员`)
    next({path: '/403'})
    // NProgress.done()
  } else {
    next()
  }
}

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const {store} = options
  if (store.state.setting.layout === 'mix') {
    const firstMenu = store.getters['setting/firstMenu']
    if (firstMenu.find(item => item.fullPath === to.fullPath)) {
      store.commit('setting/setActivatedFirst', to.fullPath)
      const subMenu = store.getters['setting/subMenu']
      if (subMenu.length > 0) {
        return next({path: subMenu[0].fullPath})
      }
    }
  }
  next()
}

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // finish progress bar
  NProgress.done()
}
store.dispatch('account/getUserInfo').then(user => {
  routers.routes.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.name !== '首页' || it.name !== '编辑项目' || it.name !== '新增项目' || it.name !== '客户详情' || it.name !== '修改密码' || it.name !== '项目详情') {
          if (user.data.memberType === 'front' && (it.name === '共享池' || it.name === '项目' || it.name === '我的客户')) {
            it.meta.invisible = false
          } else if(user.data.memberType === 'admin' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '项目管理' || it.name === '设置')) {
            it.meta.invisible = false
          } else if(user.data.memberType === 'backend' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '项目管理' || it.name === '设置')) {
            it.meta.invisible = false
          }  else {
            it.meta.invisible = true
          }
        }
      })
    }
  });
})
export default {
  beforeEach: [progressStart, loginGuard, authorityGuard, redirectGuard],
  afterEach: [progressDone]
}
