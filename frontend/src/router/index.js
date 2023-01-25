import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Accounts/LoginPage.vue'
import MyPage from '../views/MyPage.vue'
import SignupPage from '../views/Accounts/SignupPage.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue'
import StartingPage from '../views/StartingPage/StartingPage.vue'
import MainPage from '../views/MainPage/MainPage.vue'
import FindPassword from '../views/Accounts/FindPassword.vue'

const routes = [
  {
    path: '/',
    name: 'Starting',
    component: StartingPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MyPage
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingPage
  },
  {
    path: '/findpw',
    name: 'Findpw',
    component: FindPassword
  },
  {
    path: '/main',
    name: 'Main',
    component: MainPage
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
