<template>
  <a-layout-content
    :style="{
      // margin: '7% 40px 30px 20%',
      overflow: 'initial',
      background: '#fff',
      minHeight: '700px',
      minWidth: '900px',
    }"
  >
    <div>
      <router-view></router-view>
    </div>
  </a-layout-content>
</template>

<script lang="ts">
export default {};
</script>

<style lang="less" scoped>
.site-layout-background {
  background: #fff;
}
</style>
