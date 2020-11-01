import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
            {
              path: 'workplace',
              name: '首页',
              meta: {
                page: {
                  closable: false
                },
                invisible: true
              },
              component: () => import('@/pages/dashboard/workplace'),
            },
            {
              path: 'analysis',
              name: '员工管理',
              meta: {
                invisible: false
              },
              component: () => import('@/pages/dashboard/analysis'),
            },
            {
              path: 'customer',
              name: '客户管理',
              meta: {
                invisible: false
              },
              component: () => import('@/pages/dashboard/customer')
            },
            {
              path: 'customerdetails',
              name: '客户详情',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/customerDetails')
            },
            {
              path: 'shop',
              name: '店铺管理',
              meta: {
                invisible: false
              },
              component: () => import('@/pages/dashboard/shop')
            },
            {
              path: 'addshop',
              name: '新增店铺',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/addShop')
            },
            {
              path: 'shopdetails',
              name: '编辑店铺',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/shopDetails')
            },
            {
              path: 'shared',
              name: '共享池',
              meta: {
                invisible: false
              },
              component: () => import('@/pages/dashboard/shared')
            },
            {
              path: 'setting',
              name: '设置',
              meta: {
                invisible: false
              },
              component: () => import('@/pages/dashboard/setting')
            },
            {
              path: 'modifypassword',
              name: '修改密码',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/password')
            },
            {
              path: 'mycustomer',
              name: '我的客户',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/myCustomer')
            },
            {
              path: 'myshop',
              name: '店铺',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/myShop')
            },
            {
              path: 'myshopdetails',
              name: '店铺详情',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/dashboard/myShopDetails')
            }
      ]
    },
  ]
}

export default options
