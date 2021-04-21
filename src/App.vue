<template>
  <div id="app">
    <my-header/>
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
<!--    <router-view/>-->
  </div>
</template>

<script>
import MyHeader from '@/components/my-header/my-header'

export default {
  components: { MyHeader }
}
</script>

<style lang="stylus">
//#app
//  font-family Avenir, Helvetica, Arial, sans-serif
//  -webkit-font-smoothing antialiased
//  -moz-osx-font-smoothing grayscale
//  text-align center
//  color #2c3e50
//  margin-top 60px
</style>
