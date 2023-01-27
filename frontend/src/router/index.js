import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Accounts/LoginPage.vue'
import MyPage from '../views/MyPage.vue'
import SignupPage from '../views/Accounts/SignupPage.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue'
import StartingPage from '../views/StartingPage/StartingPage.vue'
import MainPage from '../views/MainPage/MainPage.vue'
import FindPassword from '../views/Accounts/FindPassword.vue'
import accountStore from '@/store/accountStore'


const requireAuth = () => (to, from, next) => {
  const token = accountStore.state.token
  if (token !== null) {
    console.log(token)
    return next();
  }
  console.log(token)
  next('/login');
};

const loginAuth = () => (to, from, next) => {
  const token = accountStore.state.token
  if (token == null) {
    return next();
  }
  router.go(-1);
};


const routes = [
  {
    path: '/',
    name: 'Starting',
    component: StartingPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    beforeEnter: loginAuth()
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MyPage,
    beforeEnter: requireAuth()
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingPage,
    beforeEnter: requireAuth()
  },
  {
    path: '/findpw',
    name: 'Findpw',
    component: FindPassword,
    beforeEnter: loginAuth()
  },
  {
    path: '/main',
    name: 'Main',
    component: MainPage,
    beforeEnter: requireAuth()
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
