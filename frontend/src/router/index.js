import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Accounts/LoginPage.vue'
import MyPage from '../views/MyPage.vue'
import SignupPage from '../views/Accounts/SignupPage.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue'
import StartingPage from '../views/StartingPage/StartingPage.vue'
import MainPage from '../views/MainPage/MainPage.vue'
import FindPassword from '../views/Accounts/FindPassword.vue'
import InGamePage from '../views/InGamePage/InGamePage.vue'
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
  router.push('main');
};


const routes = [
  {
    path: '/',
    name: 'starting',
    component: StartingPage,
    beforeEnter: loginAuth()
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
    component: SignupPage,
    beforeEnter: loginAuth()
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingPage,
    props: true,
    beforeEnter: requireAuth()
  },
  {
    path: '/findpw',
    name: 'findpw',
    component: FindPassword,
    beforeEnter: loginAuth()
  },
  {
    path: '/main',
    name: 'main',
    component: MainPage,
    beforeEnter: requireAuth()
  },
  {
    path: '/ingame',
    name: 'ingame',
    component: InGamePage,
    // beforeEnter: requireAuth()
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
