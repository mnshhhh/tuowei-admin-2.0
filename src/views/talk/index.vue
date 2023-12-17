<template>
  <a-row class="talkContent">
    <a-col :span="5" class="left">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="bright"
        :class="{ active: current == index }"
        @click="change(index)"
      >
        <router-link :to="{ name: 'talkView' }">
          <div class="left-list">
            <div class="list-iron">
              <a-avatar
                :src="
                  type == '1'
                    ? 'https://z1.ax1x.com/2023/10/10/pPzn9yQ.png'
                    : 'https://z1.ax1x.com/2023/10/10/pPznSSS.png'
                "
              />
            </div>
            <div class="list-title">
              {{ item.name
              }}{{ item.id == 0 ? "" : type == "1" ? "用户" : "医生" }}
            </div>
          </div>
        </router-link>
      </div>
    </a-col>
    <a-col :span="19">
      <router-view :talkPeo="talkPeo"></router-view>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { get } from "@/request/request";
import { defineComponent, onMounted, reactive, ref, toRaw, watch } from "vue";
import { useTalkStore } from "@/stores/talk";
import { storeToRefs } from "pinia";
export default defineComponent({
  setup() {
    const type = localStorage.getItem("type");
    let data = reactive([
      {
        name: "消息列表",
        id: 0,
      },
    ]);
    // 父传子聊天页面
    let talkPeo = ref<number>();
    // 开启深度监听
    const deepData = reactive({ ...data });
    const store = useTalkStore();
    const { dataNew } = storeToRefs(store);
    let talkList = [0];
    watch(dataNew, (n) => {
      const toN = toRaw(n);
      // const toO = toRaw(o);
      for (let j = 0; j < toN.length; j++) {
        let n = data.length;
        let na = 0;
        for (let i = 0; i < n; i++) {
          let s = data[i].id == toN[j];
          if (!s && toN[j]) ++na;
          if (na == n) {
            data.push({
              id: toN[j],
              name: String(toN[j]),
            });
            talkList.push(toN[j]);
          }
        }
        localStorage.setItem("talkList", JSON.stringify(talkList));
      }
    });
    onMounted(async () => {
      //获取医生信息
      try {
        const token: any = localStorage.getItem("token");
        const res: any = await get("/doctor/list?page=1&pageSize=1000", token);
        if (res.code == 1 && type == "0") {
          let n = res.data.total;
          for (let i = 0; i < n; i++) {
            if (i == 0 && deepData[0].id == 0) {
              deepData[0].id = res.data.records[0].id;
              deepData[0].name = res.data.records[0].name;
            } else {
              data.push({
                id: res.data.records[i].id,
                name: res.data.records[i].name,
              });
            }
          }
        }
      } catch {
        console.log("获取医生信息失败");
      }
      let listMore: any = localStorage.getItem("talkList");
      listMore = JSON.parse(listMore);
      console.log(listMore);
      for (let j = 0; j < listMore.length; j++) {
        let n = data.length;
        let na = 0;
        for (let i = 0; i < n; i++) {
          let s = data[i].id == listMore[j];
          if (!s && listMore[j]) ++na;
          if (na == n) {
            data.push({
              id: listMore[j],
              name: String(listMore[j]),
            });
          }
        }
      }
    });
    let current = ref(0);
    let change = (index: number) => {
      current.value = index;
      // console.log(current);
      console.log(index);
      talkPeo.value = data[index].id;
    };
    return {
      type,
      data,
      current,
      change,
      talkPeo,
    };
  },
});
</script>
<style lang="less" scoped>
.talkContent {
  word-break: normal;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  height: 88vh;
  //ie10+隐藏滚动条
  -ms-overflow-style: none;
  // firefox
  overflow: -moz-scrollbars-none;
  ::-webkit-scrollbar {
    //chrome 和 safari
    width: 0 !important;
  }
  .left {
    border-right: 1px solid #ccc;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    .left-list {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px 0px 30px 20px;
      color: #333;
      :hover {
        color: rgb(78, 144, 255);
      }
      // border: 1px solid #333;
      .list-title {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;

        word-break: normal;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}
.active {
  background-color: rgb(230, 247, 255);
  color: rgb(78, 144, 255);
  transition: all 0.2s linear;
  border-right: 2px solid #1880ff;
}
</style>
