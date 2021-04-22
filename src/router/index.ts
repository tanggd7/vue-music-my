import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const Recommend = () => import(/* webpackChunkName: "recommend" */ '../components/recommend/recommend.vue')
const Singer = () => import(/* webpackChunkName: "singer" */ '../components/singer/singer.vue')
const Rank = () => import(/* webpackChunkName: "rank" */ '../components/rank/rank.vue')
const Search = () => import(/* webpackChunkName: "search" */ '../components/search/search.vue')

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/recommend' },
  { path: '/recommend', component: Recommend },
  { path: '/singer', component: Singer },
  { path: '/rank', component: Rank },
  { path: '/search', component: Search }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
