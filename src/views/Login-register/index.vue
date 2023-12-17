<template>
  <div class="header">
    <img class="img" src="https://z1.ax1x.com/2023/10/11/pPzdYV0.png" />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <wave />
  </div>
  <div class="content flex">
    <p>拓维医学系统 ©2023 Created by Ant UED</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Wave from "./Wave.vue";

export default defineComponent({
  components: {
    Wave,
  },
});
</script>

<style scoped>
@import url(//fonts.googleapis.com/css?family=Lato:300:400);

body {
  margin: 0;
}

.header {
  position: relative;
  text-align: center;
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
  color: white;
}

.v-leave-to {
  opacity: 0;
}

.v-enter-from {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease-in;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}

p {
  font-family: "Lato", sans-serif;
  letter-spacing: 1px;
  font-size: 14px;
  color: #333333;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.content {
  position: relative;
  height: 10vh;
  text-align: center;
  background-color: white;
}

.img {
  width: 40%;
  position: absolute;
  z-index: 1;
  left: 14%;
  top: 6%;
  opacity: 0.8;
}
</style>
