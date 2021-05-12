import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const Recommend = () => import(/* webpackChunkName: "recommend" */ '../components/recommend/recommend.vue')
const Disc = () => import(/* webpackChunkName: "disc" */ '../components/disc/disc.vue')
const Singer = () => import(/* webpackChunkName: "singer" */ '../components/singer/singer.vue')
const SingerDetail = () => import(/* webpackChunkName: "singer-detail" */ '../components/singer-detail/singer-detail.vue')
const Rank = () => import(/* webpackChunkName: "rank" */ '../components/rank/rank.vue')
const TopList = () => import(/* webpackChunkName: "top-list" */ '../components/top-list/top-list.vue')
const Search = () => import(/* webpackChunkName: "search" */ '../components/search/search.vue')

const routes: Array<RouteConfig> = [
  { path: '/', redirect: '/recommend' },
  { path: '/recommend', component: Recommend, children: [{ path: ':id', component: Disc }] },
  { path: '/singer', component: Singer, children: [{ path: ':id', component: SingerDetail }] },
  { path: '/rank', component: Rank, children: [{ path: ':id', component: TopList }] },
  { path: '/search', component: Search }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
