import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import layout from '@/layout/index'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const privateRoutes = [
  {
    path: '/user',
    component: layout,
    redirect: '/user/manage',
    name: 'user',
    meta: {
      title: '用户',
      icon: 'el-user'
    },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/user-manage/index'),
        meta: {
          title: '用户管理',
          icon: 'personnel-manage'
        }
      },
      {
        path: 'info/:id',
        name: 'userInfo',
        hidden: true,
        component: () => import('@/views/user-info/index'),
        props: true,
        meta: {
          title: '用户详情'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/role-list/index'),
        meta: {
          title: '角色列表',
          icon: 'role'
        }
      },
      {
        path: 'import',
        name: 'import',
        hidden: true,
        component: () => import('@/views/import/index'),
        meta: {
          title: 'excelImport'
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/permission-list/index'),
        meta: {
          title: '权限列表',
          icon: 'permission'
        }
      }
    ]
  },
  {
    path: '/article',
    component: layout,
    redirect: '/article/ranking',
    name: 'article',
    meta: { title: '文章', icon: 'article' },
    children: [
      {
        path: 'ranking',
        component: () => import('@/views/article-ranking/index'),
        meta: {
          title: '文章排名',
          icon: 'article-ranking'
        }
      },
      {
        path: 'create',
        component: () => import('@/views/article-create/index'),
        meta: {
          title: '创建文章',
          icon: 'el-document-add'
        }
      },
      {
        path: 'editor/:id',
        hidden: true,
        component: () => import('@/views/article-create/index'),
        meta: {
          title: '文章编辑'
        }
      },
      {
        path: ':id',
        hidden: true,
        component: () => import('@/views/article-detail/index'),
        meta: {
          title: '文章详情'
        }
      }
    ]
  }
]

export const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    hidden: true,
    component: Register
  },
  {
    path: '/',
    component: layout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index'),
        meta: {
          title: '个人中心',
          icon: 'personnel'
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    component: () => import('@/views/404')
  }
]

const router = createRouter({
  // 本地开发使用hash模式以阻止重载页面（路由切换发起请求）
  history: import.meta.env.MODE === 'production' ? createWebHistory() : createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes]
})

export default router
