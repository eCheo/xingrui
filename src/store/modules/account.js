import { request ,METHOD } from '../../utils/request'
import routers from '../../router/config'
export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    routesConfig: null,
    userInfo: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    routesConfig: state => {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
          state.routesConfig = JSON.parse(routesConfig)
          state.routesConfig = state.routesConfig ? state.routesConfig : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.routesConfig
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
    },
    setRoutesConfig(state, routesConfig) {
      state.routesConfig = routesConfig
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    getUserInfo({commit}) {
      return new Promise((resolve, reject) => {
      request('/api/backend/member/findMember.json', METHOD.GET).then(res => {
        if (res.status === 200 && res.data.code === '200') {
          routers.routes.forEach(item => {
            if (item.children) {
              item.children.forEach(it => {
                if (it.name !== '首页' || it.name !== '编辑铺源' || it.name !== '新增铺源' || it.name !== '客户详情' || it.name !== '修改密码' || it.name !== '铺源详情') {
                  if (res.data.data.memberType === 'front' && (it.name === '共享池' || it.name === '铺源' || it.name === '我的客户')) {
                    it.meta.invisible = false
                  } else if(res.data.data.memberType === 'admin' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '铺源管理' || it.name === '设置')) {
                    it.meta.invisible = false
                  } else if(res.data.data.memberType === 'backend' && (it.name === '员工管理' || it.name === '客户管理' || it.name === '铺源管理' || it.name === '设置')) {
                    it.meta.invisible = false
                  }  else {
                    it.meta.invisible = true
                  }
                }
              })
            }
          });
          commit('setUserInfo', res.data.data)
          resolve(res.data)
        }
      }).catch(err => {
        reject(err)
      })
    })
    }
  }
}
