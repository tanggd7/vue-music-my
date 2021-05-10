<template>
  <div id="app">
    <my-header/>
    <tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player/>
  </div>
</template>

<script>
import MyHeader from '@/components/my-header/my-header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  components: { MyHeader, Tab, Player }
}
</script>

<style lang="stylus">
</style>
