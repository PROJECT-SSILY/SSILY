import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/Accounts/LoginPage.vue'
import MyPage from '../views/MyPage.vue'
import SignupPage from '../views/Accounts/SignupPage.vue'
import WaitingPage from '@/views/WaitingPage/WaitingPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
