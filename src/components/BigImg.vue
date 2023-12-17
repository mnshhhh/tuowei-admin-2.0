<template>
  <div v-show="visible" @click="$emit('closeClick')" class="showPhoto">
    <img class="img" :src="url" alt="图片加载失败" />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="css" scoped>
.showPhoto {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(70, 68, 68, 0.6);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.showPhoto .img {
  display: block;
  margin: auto 0;
  max-width: 46%;
  text-align: center;
}
</style>
