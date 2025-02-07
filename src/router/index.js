import { createRouter, createWebHistory } from 'vue-router'
import CreateView from '../views/CreateView.vue'
import ListView from '../views/ListView.vue'
import DetailView from '../views/DetailView.vue'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import FindPasswordView from '../views/FindPasswordView.vue'
import FindIdView from '../views/FindIdView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import ResultIdView from '../views/ResultIdView.vue'
import ResultPwView from '../views/ResultPwView.vue'
import LikeTopListView from '../views/LikeTopListView.vue'
import ViewTopListView from '../views/ViewTopListView.vue'
import MyBoardListView from '../views/MyBoardListView.vue'
import MyLikeListView from '../views/MyLikeListView.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/board/list',
    name: 'ListView',
    component: ListView,
  },
  {
    path: '/board/likeTopList',
    name: 'LikeTopListView',
    component: LikeTopListView,
  },
  {
    path: '/board/post',
    name: 'CreateView',
    component: CreateView,
  },
  {
    path: '/board/detail/:sysNo',
    name: 'DetailView',
    component: DetailView,
  },
  {
    path: '/board/signup',
    name: 'SignUpView',
    component: SignUpView,
  },
  {
    path: '/board/findpassword',
    name: 'FindPasswordView',
    component: FindPasswordView,
  },
  {
    path: '/board/findid',
    name: 'FindIdView',
    component: FindIdView,
  },
  {
    path: '/board/userDetail',
    name: 'UserDetailView',
    component: UserDetailView,
  },
  {
    path: '/board/resultId',
    name: 'ResultIdView',
    component: ResultIdView,
  },
  {
    path: '/board/resultPw',
    name: 'ResultPwView',
    component: ResultPwView,
  },
  {
    path: '/board/viewTopList',
    name: 'ViewTopListView',
    component: ViewTopListView,
  },
  {
    path: '/board/myBoardList',
    name: 'MyBoardListView',
    component: MyBoardListView,
  },
  {
    path: '/board/myLikeList',
    name: 'MyLikeListView',
    component: MyLikeListView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
