<template>
  <div v-show="talkPeo">
    <div class="chat-content" ref="scrollContainer">
      <!-- recordContent 聊天记录数组-->
      <div v-for="itemc in msgs" :key="itemc.id">
        <!-- 对方 -->
        <div
          class="word"
          v-if="
            itemc.mineMsgid != id
              ? itemc.mineMsgid == 0
                ? false
                : true
              : false
          "
        >
          <img
            :src="
              type == '1'
                ? 'https://z1.ax1x.com/2023/10/10/pPzn9yQ.png'
                : 'https://z1.ax1x.com/2023/10/10/pPznSSS.png'
            "
          />
          <div class="info">
            <p class="time">
              {{ type == "1" ? "用户" : "医生" }}
            </p>
            <div class="info-content">{{ itemc.contactText }}</div>
          </div>
        </div>
        <!-- 我的 -->
        <div class="word-my" v-else>
          <div class="info">
            <p class="time">
              {{ type == "0" ? "用户" : "医生" }}
            </p>
            <div class="info-content">{{ itemc.contactText }}</div>
          </div>
          <img
            :src="
              type == '0'
                ? 'https://z1.ax1x.com/2023/10/10/pPzn9yQ.png'
                : 'https://z1.ax1x.com/2023/10/10/pPznSSS.png'
            "
          />
        </div>
      </div>
    </div>
    <!-- 输入区域 -->
    <div class="chatting-input">
      <a-space direction="vertical" class="input_witdh">
        <a-input-search
          v-model:value="value"
          placeholder="input search text"
          enter-button="Send"
          size="large"
          @search="onSearch"
        />
      </a-space>
    </div>
  </div>
</template>
<script lang="ts">
import { get, post } from "@/request/request";
import { message } from "ant-design-vue";
import { defineComponent, onMounted, onUpdated, ref, watch } from "vue";
export default defineComponent({
  props: {
    talkPeo: {
      type: Number,
    },
  },
  setup(props) {
    const id: any = localStorage.getItem("id");
    const type: any = localStorage.getItem("type");
    const token: any = localStorage.getItem("token");
    let recordContent: any[] = [
      {
        mineMsgid: 0,
        // timestamp: "timestamp",
        contactText: "（拓维医生已上线，请留言）",
        sendTime: "2022-22-22 11:11:11",
        id: 0,
      },
    ];
    let msg = ref(recordContent);
    let msgs = msg.value;
    const value = ref<string>("");
    // let n = 1;
    const onSearch = async (searchValue: string) => {
      if (searchValue.trim()) {
        try {
          const ress: any = await post(
            "/message/chat",
            {
              fromUserId: id,
              toUserId: props.talkPeo,
              content: searchValue,
              type: 0,
            },
            token
          );
          if (ress.code == 1) {
            message.info(ress.msg);
          }
        } catch {
          message.info("发送失败");
        }
        msgs.length = 0;
        msgs.push({
          mineMsgid: 0,
          contactText: "（拓维医生已上线，请留言）",
          sendTime: "2022-22-22 11:11:11",
          id: 0,
        });
        try {
          const res: any = await get(
            "message/getMsgs?fromUserId=" +
              id +
              "&toUserId=" +
              show.value +
              "&page=1&pageSize=1000",
            token
          );
          if (res.code == 1) {
            const n = res.data.total;
            for (let i = 0; i < n; i++) {
              // 将第一项内容替换
              if (i == 0 && msgs[0].id == 0 && res.data.records[0].content) {
                msgs[i].mineMsgid = res.data.records[i].fromUserId;
                msgs[i].contactText = res.data.records[i].content;
                msgs[i].id = res.data.records[i].id;
                msgs[i].sendTime = res.data.records[i].sendTime;
              } else {
                msgs.push({
                  mineMsgid: res.data.records[i].fromUserId,
                  contactText: res.data.records[i].content,
                  id: res.data.records[i].id,
                  sendTime: res.data.records[i].sendTime,
                });
              }
            }
          }
          msgs.sort(dateData("sendTime"));
        } catch {
          console.log("获取聊天记录失败");
        }
        value.value = "";
      }
    };
    const show = ref();
    // 对日期进行混合排序
    function dateData(property: string | number) {
      return function (a: { [x: string]: any }, b: { [x: string]: any }) {
        var value1 = a[property];
        var value2 = b[property];
        return Date.parse(value1) - Date.parse(value2);
      };
    }
    watch(
      () => props.talkPeo,
      async (n) => {
        msgs.length = 0;
        msgs.push({
          mineMsgid: 0,
          contactText: "（拓维医生已上线，请留言）",
          sendTime: "2022-22-22 11:11:11",
          id: 0,
        });
        show.value = n;
        const token: any = localStorage.getItem("token");
        const id: any = localStorage.getItem("id");
        try {
          const res: any = await get(
            "message/getMsgs?fromUserId=" +
              n +
              "&toUserId=" +
              id +
              "&page=1&pageSize=1000",
            token
          );
          if (res.code == 1) {
            const n = res.data.total;
            for (let i = 0; i < n; i++) {
              // 将第一项内容替换
              if (i == 0 && msgs[0].id == 0) {
                msgs[i].mineMsgid = res.data.records[i].fromUserId;
                msgs[i].contactText = res.data.records[i].content;
                msgs[i].id = res.data.records[i].id;
                msgs[i].sendTime = res.data.records[i].sendTime;
              } else {
                msgs.push({
                  mineMsgid: res.data.records[i].fromUserId,
                  contactText: res.data.records[i].content,
                  id: res.data.records[i].id,
                  sendTime: res.data.records[i].sendTime,
                });
              }
            }
          }
          msgs.sort(dateData("sendTime"));
        } catch {
          console.log("获取聊天记录失败");
        }
      }
    );
    // 滚动条默认滑到底部
    const scrollContainer = ref(null) as any;
    onUpdated(() => {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    });
    onMounted(() => {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    });
    return {
      value,
      onSearch,
      scrollContainer,
      msgs,
      id,
      type,
      show,
      // props,
    };
  },
});
</script>
<style lang="less" scoped>
.chat-content {
  width: 100%;
  padding: 20px 30px;
  height: 78vh;
  overflow-y: scroll;
  .word {
    display: flex;
    margin-bottom: 20px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .info {
      margin-left: 10px;
      .time {
        font-size: 12px;
        color: rgba(51, 51, 51, 0.8);
        margin: 0;
        height: 20px;
        line-height: 20px;
        margin-top: -5px;
        word-break: break-all;
      }
      .info-content {
        padding: 10px;
        font-size: 14px;
        background: #a3c3f6;
        position: relative;
        margin-top: 8px;
        max-width: 600px;
        // min-width: 50px;
        word-break: normal;
        white-space: pre-wrap;
        word-wrap: break-word;
        // overflow: hidden;
      }
      //小三角形
      .info-content::before {
        position: absolute;
        left: -8px;
        top: 8px;
        content: "";
        border-right: 10px solid #a3c3f6;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
      }
    }
  }

  .word-my {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .info {
      width: 90%;
      margin-left: 10px;
      text-align: right;
      .time {
        font-size: 12px;
        color: rgba(51, 51, 51, 0.8);
        margin: 0;
        height: 20px;
        line-height: 20px;
        margin-top: -5px;
        margin-right: 10px;
      }
      .info-content {
        max-width: 70%;
        padding: 10px;
        font-size: 14px;
        float: right;
        margin-right: 10px;
        position: relative;
        margin-top: 8px;
        background: #a3c3f6;
        text-align: left;
      }
      //小三角形
      .info-content::after {
        position: absolute;
        right: -8px;
        top: 8px;
        content: "";
        border-left: 10px solid #a3c3f6;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
      }
    }
  }
}
.chatting-input {
  position: absolute;
  padding: 10px;
  bottom: 2%;
  left: 50%;
  transform: translateX(-500px);
  width: 1000px;
  .input_witdh {
    width: 100%;
    .a-input-search {
      height: 40px;
    }
  }
}
</style>
