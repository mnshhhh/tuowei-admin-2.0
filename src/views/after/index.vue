<template>
  <div class="pad">
    <a-spin
      :spinning="false"
      tip="正在分割中..."
      style="margin: 7% 40px 30px 20%"
    >
      <div class="img">
        <img
          v-if="isloading == 1"
          :width="540"
          src="https://s1.ax1x.com/2023/05/06/p9agRkF.png"
          @click="showBigImage()"
          @click.right="showBigImage1($event)"
        />
        <a-image
          v-if="spinning"
          :width="600"
          style="margin-top: 50px"
          src="https://s1.ax1x.com/2023/05/06/p9a2tj1.png"
        />
      </div>
      <a-button
        v-if="isloading == 1"
        class="but"
        size="large"
        type="primary"
        shape="round"
        @click="change"
        >查看报告</a-button
      ><a-button
        v-if="isloading == 3 || spinning"
        class="but1"
        size="large"
        type="primary"
        shape="round"
        @click="
          () => {
            (spinning = false), (isloading = 1);
          }
        "
        >返回图片</a-button
      >
      <div class="img2">
        <a-image
          :width="480"
          src="https://s1.ax1x.com/2023/05/06/p9a2Z1s.png"
        />
      </div>
      <RollbackOutlined
        class="but2"
        @click="change1"
        :style="{ fontSize: '30px', color: 'rgba(70, 68, 68, 0.6)' }"
      />
      <BigImg
        :visible="photoVisible"
        :url="bigImgUrl"
        @closeClick="
          () => {
            photoVisible = false;
          }
        "
      />
    </a-spin>
  </div>
</template>
<script lang="ts">
import { RollbackOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import BigImg from "../../components/BigImg.vue";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { BigImg, RollbackOutlined },
  setup() {
    let bigImgUrl = ref("");
    let router = useRouter();
    let photoVisible = ref(false);
    const change1 = function () {
      router.push({ name: "details" });
    };
    var showBigImage1 = function (e: any) {
      e.preventDefault();
      photoVisible.value = true;
      bigImgUrl.value = "https://s1.ax1x.com/2023/05/06/p9aWNTK.png";
    };
    var showBigImage = function () {
      photoVisible.value = true;
      bigImgUrl.value = "https://s1.ax1x.com/2023/05/06/p9agRkF.png";
    };
    let isloading = ref(1);
    let spinning = ref(false);
    const changeimg = function () {
      isloading.value = 3;
    };
    const change = function () {
      spinning.value = true;
      isloading.value = 2;
    };
    return {
      isloading,
      showBigImage1,
      photoVisible,
      RollbackOutlined,
      bigImgUrl,
      change,
      spinning,
      showBigImage,
      changeimg,
      change1,
    };
  },
});
</script>
<style scoped>
.pad {
  padding: 20px;
}
.img {
  position: relative;
  top: 8%;
  left: 55%;
  width: 500px;
}
.img2 {
  position: absolute;
  top: 50px;
  left: 8%;
}
.table {
  position: absolute;
  top: -70px;
  left: -25%;
}
.but {
  position: relative;
  right: -1000px;
  top: 18px;
}
.but1 {
  position: relative;
  left: 68%;
  margin-top: 20px;
}
.but2 {
  position: absolute;
  left: 0%;
  top: 0%;
}
</style>
