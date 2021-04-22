<template>
  <div id="app">
    <my-header/>
    <tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
<!--    <router-view/>-->
  </div>
</template>

<script>
import MyHeader from '@/components/my-header/my-header'
import Tab from '@/components/tab/tab'

export default {
  components: { MyHeader, Tab }
}
</script>

<style lang="stylus">
</style>
