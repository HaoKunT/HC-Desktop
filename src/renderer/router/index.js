import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/mapview',
    component: Layout,
    redirect: 'noredirect',
    name: 'Visual Map',
    meta: {
      title: 'visualmap',
      icon: 'international'
    },
    children: [
      {
        path: 'map',
        component: _import('mapview/map'),
        name: 'ArcGISMap',
        meta: { title: 'arcgismap', noCache: false }
      },
      {
        path: 'scene',
        component: _import('mapview/scene'),
        name: 'ArcGISScene',
        meta: { title: 'arcgissence', noCache: false }
      }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      // { path: 'national', component: _import('charts/national'), name: 'national', meta: { title: 'national', noCache: true }},
      {
        path: 'singlecity',
        component: _import('charts/singlecity'),
        name: 'singlecity',
        meta: { title: 'singlecity', noCache: true }
      },
      {
        path: 'multicity',
        component: _import('charts/multicity'),
        name: 'multicity',
        meta: { title: 'multicity', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true }]
