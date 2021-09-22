import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
// 解决触发同一路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    children:[
      {
        path:'/index',
        name:'index',
        component:()=> import('@/views/index')
      }
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    title:"基础设置",
    icon:'paper-icon.png',
    children:[
      {
        path:'/school',
        name:'school',
        component:()=> import('@/views/baseSet/school/school.vue'),
        meta: {
          title: '学校管理'
        }
      },
      {
        path: '/station',
        name: 'station',
        component: () => import('@/views/baseSet/station/station.vue'),
        meta: {
          title: '函授站管理'
        }
      },
      {
        path:'/major',
        name:'major',
        component:()=> import('@/views/baseSet/major/major.vue'),
        meta: {
          title: '专业管理'
        },
      },
      {
        path:'/course',
        name:'course',
        component:()=> import('@/views/baseSet/course/course.vue'),
        meta: {
          title: '课程管理'
        }
      },
      {
        path:'/examSite',
        name:'examSite',
        component:()=> import('@/views/baseSet/examSite/examSite.vue'),
        meta: {
          title: '考点管理'
        },
        children: [
          {
            path: 'add',
            name: 'addSite',
            meta: {
              title: '新增考点'
            },
            component: () => import('@/views/baseSet/examSite/addSite.vue')
          }
        ]
      },
      {
        path:'/classroom',
        name:'classroom',
        component:()=> import('@/views/baseSet/classroom/classroom.vue'),
        meta: {
          title: '教室管理'
        }
      },
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    title:"报名管理",
    icon:'agency-icon.png',
    children:[
      {
        path:'/applyManage',
        name:'applyManage',
        component:()=> import('@/views/applySet/applyManage.vue'),
        meta: {
          title: '报缴信息管理'
        },
        children:[
          {
            path:'/applyManage/applyManageAdd',
            name:'applyManageAdd',
            component:()=> import('@/views/applySet/applyManageAdd.vue'),
            meta: {
              title: '新增报缴信息'
            },

          },
        ]
      },
      {
        path:'/applyAudit',
        name:'applyAudit',
        component:()=> import('@/views/applySet/applyAudit.vue'),
        meta: {
          title: '报名审核'
        },
        children:[
          {
            path:'/applyAudit/applyAuditDetail',
            name:'applyAuditDetail',
            component:()=> import('@/views/applySet/applyAuditDetail.vue'),
            meta: {
              title: '审核详情'
            },

          },
        ]
      },

    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    title:"考试管理",
    icon:'exam-icon.png',
    children:[
      {
        path:'/examBatch',
        name:'examBatch',
        component:()=> import('@/views/examSet/examBatch/examBatch.vue'),
        meta: {
          title: '考试批次管理'
        },
        children: [
          {
            path: 'add',
            name: 'addBatch',
            meta: {
              title: '新增考试批次'
            },
            component: () => import('@/views/examSet/examBatch/addBatch.vue')
          },
          {
            path: 'check',
            name: 'checkBatch',
            meta: {
              title: '查看考试批次'
            },
            component: () => import('@/views/examSet/examBatch/checkBatch.vue')
          },
        ]
      },

      {
        path:'/section',
        name:'section',
        component:()=> import('@/views/examSet/section/section.vue'),
        meta: {
          title: '场次设置'
        },
        children: [
          {
            path: 'add',
            name: 'addSection',
            meta: {
              title: '新增场次'
            },
            component: () => import('@/views/examSet/section/addSection.vue')
          },
          {
            path: 'edit',
            name: 'editSection',
            meta: {
              title: '编辑场次'
            },
            component: () => import('@/views/examSet/section/addSection.vue')
          },
          {
            path: 'check',
            name: 'checkSection',
            meta: {
              title: '查看场次'
            },
            component: () => import('@/views/examSet/section/checkSection.vue')
          }
        ]
      },
      {
        path:'/classSet',
        name:'classSet',
        component:()=> import('@/views/examSet/classSet/classSet.vue'),
        meta: {
          title: '考场安排'
        },
        children: [
          {
            path: 'history',
            name: 'historyClass',
            meta: {
              title: '历史查询'
            },
            component: () => import('@/views/examSet/classSet/history.vue')
          },
          {
            path: 'student',
            name: 'student',
            meta: {
              title: '考生安排'
            },
            component: () => import('@/views/examSet/classSet/student.vue')
          },
        ]
      },
      {
        path:'/score',
        name:'score',
        component:()=> import('@/views/examSet/score/score.vue'),
        meta: {
          title: '成绩管理'
        },
        children: [
          {
            path: 'history',
            name: 'historyScore',
            meta: {
              title: '历史查询'
            },
            component: () => import('@/views/examSet/score/historyScore.vue')
          },
          {
            path: 'currentScore',
            name: 'currentScore',
            meta: {
              title: '考生成绩'
            },
            component: () => import('@/views/examSet/score/currentScore.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    title:"系统设置",
    icon:'setting-icon.png',
    children:[
      {
        path:'/systemSet',
        name:'systemSet',
        component:()=> import('@/views/system/systemSet'),
        meta: {
          title: '系统设置'
        }
      },
	  {
	    path:'/TestIndex',
	    name:'TestIndex',
	    component:()=> import('@/views/manage/manage'),
	    meta: {
	      title: ''
	    }
	  }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue')
  },

  // 学生端
  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/register',
        name: 'register',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/register/register.vue'),
      },
      {
        path: '/stuHome/userConfig',
        name: 'userConfig',
        meta: {
          title: '账户设置',
          isStudent: true
        },
        component: () => import('@/views/student/userConfig/userConfig.vue'),
      }
    ]
  },
  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/resetPassword',
        name: 'resetPassword',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/resetPassword/resetPassword.vue'),
      }
    ]
  },
  {
    path : '/stuHome',
    name : 'stuHome',
    redirect: '/stuHome/home',
    component: () => import('@/views/student/stuHome.vue'),
    children : [
      {
        path: '/stuHome/home',
        name: 'home',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/home/home.vue'),
      },
    ]
  },
  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/stuApply',
        name: 'stuApply',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/stuApply/stuApply.vue'),
      },
      {
        path: '/stuHome/stuExamine',
        name: 'stuApply',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/stuApply/examine.vue'),
      },
      {
        path: '/stuHome/secondApply',
        name: 'secondApply',
        meta: {
          isStudent: true
        },
        component: () => import('@/views/student/stuApply/secondApply.vue'),
      },
    ]
  },

  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/payFee',
        name: 'payFee',
        meta: {
          title: '缴费',
          isStudent: true
        },
        component: () => import('@/views/student/payFee/payFee.vue'),
      }
    ]
  },
  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/ticket',
        name: 'ticket',
        meta: {
          title: '准考证',
          isStudent: true
        },
        component: () => import('@/views/student/ticket/ticket.vue'),
      }
    ]
  },
  {
    path: '/stuHome',
    name: 'stuHome',
    redirect: '/stuHome/stuApply',
    component: () => import('@/views/student/stuHome.vue'),
    children:[
      {
        path: '/stuHome/score',
        name: 'stuScore',
        meta: {
          title: '成绩查询',
          isStudent: true
        },
        component: () => import('@/views/student/score/score.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((to, from, next) => {
    if(to.name !=='Login' && !localStorage.getItem('userInfo') && to.name !=='register' && to.name !=='resetPassword') {
        next('/Login')
    }else if (localStorage.getItem('userInfo')){
      if (to.name =='Login') {
        next()
      } else {
        let routerArea = 'student'
        if (to.meta && to.meta.isStudent) {
        } else {
          routerArea = 'teacher'
        }
        let loc = JSON.parse(localStorage.getItem('userInfo'))
        if(loc.roleType === 2) {
            if (routerArea == 'student') {
                next()
            } else {
                next('/stuHome/home')
            }
        }else if(loc.roleType === 1) {
            if (routerArea == 'teacher') {
                next()
            } else {
                next('/index')
            }
        }
      }
    }else {
        next()
    }
})
// router.beforeEach((to, from, next) => {
//   if(to.name !=='Login' && !localStorage.getItem('userInfo') && to.name !=='register' && to.name !=='resetPassword') {
//     next('/Login')
//   }else {
//     next()
//   }
// })

export default router
