<template>
  <div class="bgc">
    <div class="chatting">
      <!-- 聊天界面头部 -->
      <!-- <div class="chatting-header">
      <div class="chatting-title">
          <h2>AI人工智能</h2>
      </div>
      <div class="chayying-menu">
          <h2>···</h2>
      </div>
      </div> -->
      <!-- 聊天内容区域 -->
      <div class="content-vis">
        <div
          id="chattingContent"
          class="chatting-content chatdom"
          ref="scrollContainer"
        >
          <div class="content-AI">
            <div class="img">
              <a-space :size="16" wrap>
                <a-avatar shape="square">
                  <template #icon>
                    <img src="../../../public/logo.png" />
                  </template>
                </a-avatar>
              </a-space>
            </div>
            <div class="msg">
              <h2>你好，我是拓维医学机器人</h2>
              <span class="msg-content"
                >作为你的智能伙伴，我将为你答疑解惑。</span
              >
              <img src="./images/14.png" style="width: 500px; height: 500px" />
            </div>
          </div>
          <div class="box" v-for="item of msgs.values" :key="item.que">
            <div class="content-user" v-if="item.s">
              <div class="img">
                <a-space :size="16" wrap>
                  <a-avatar style="background-color: #5897df">
                    <template #icon>
                      <user-outlined />
                    </template>
                  </a-avatar>
                </a-space>
              </div>
              <div class="msg user-bgc">
                <span class="msg-content">{{ item.que }}</span>
              </div>
            </div>
            <div class="content-AI" v-if="item.s">
              <div class="img">
                <a-space :size="16" wrap>
                  <a-avatar shape="square">
                    <template #icon>
                      <img src="../../../public/logo.png" />
                    </template>
                  </a-avatar>
                </a-space>
              </div>
              <div class="msg">
                <span class="msg-content" style="color: #2e2e2e">{{
                  item.ans
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="chatting-input">
        <a-space direction="vertical" class="input_witdh">
          <a-input-search
            v-model:value="value"
            placeholder="input search text"
            :loading="loading"
            enter-button="发送"
            size="large"
            @search="onSearch"
          />
        </a-space>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onUpdated } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";
import { post } from "@/request/request";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {
    UserOutlined,
  },
  setup() {
    let msgs = reactive({
      values: [
        {
          que: "1",
          ans: "1 ",
          s: false,
        },
      ],
    });
    const value = ref<string>("");
    let loading = ref<boolean>(false);
    const id = localStorage.getItem("id");
    const token: any = localStorage.getItem("token");
    const onSearch = async (searchValue: string) => {
      msgs.values.push({
        que: searchValue,
        ans: "思考中~",
        s: true,
      });
      loading.value = true;
      value.value = "";
      try {
        const res: any = await post(
          "/chat/chatGPT",
          {
            userId: id,
            question: searchValue,
            //上下文交互待做
            // conversationId: ffeec8c8-0e05-494a-99a3-688de5422069,
            // parentMessageId: b90663b3-106e-489b-89c6-7d93dce982e7,
          },
          token
        );
        if (res.code === 1 && res.data.text) {
          msgs.values[msgs.values.length - 1].ans = res.data.text;
          sessionStorage.setItem("msgs", JSON.stringify(msgs.values));
        } else
          msgs.values[msgs.values.length - 1].ans = "暂不支持回答，请稍后重试";
        loading.value = false;
      } catch {
        message.info("请求失败");
        loading.value = false;
      }
    };
    // 滚动条默认滑到底部
    const scrollContainer = ref(null) as any;
    onUpdated(() => {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      const mesValues = JSON.stringify(msgs.values);
      sessionStorage.setItem("msgs", mesValues);
    });
    onMounted(() => {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      let zanshi: any = sessionStorage.getItem("msgs");
      console.log(sessionStorage.getItem("msgs"));
      if (zanshi) msgs.values = JSON.parse(zanshi);
    });
    return {
      msgs,
      value,
      loading,
      onSearch,
      scrollContainer,
    };
  },
});
</script>
<style lang="less" scoped>
.bgc {
  background-color: #f0f2f5;
  padding: 10px;
  .chatting {
    width: 70%;
    margin: 0 auto;
    // background-color: #fff;
    border-radius: 15px;
    //ie10+隐藏滚动条
    -ms-overflow-style: none;
    // firefox
    overflow: -moz-scrollbars-none;
    ::-webkit-scrollbar {
      //chrome 和 safari
      width: 0 !important;
    }
  }
}
.element::-webkit-scrollbar {
  display: none;
}
.content-vis {
  .chatting-content {
    overflow-y: scroll;
    padding: 15px;
    height: 77vh;
    // overflow: hidden;
    margin-bottom: 40px;
    .content-AI,
    .content-user {
      display: flex;
      padding-bottom: 10px;
      .img {
        margin: 8px 10px 10px 0;
        border-radius: 5px;
      }
      .msg {
        background-color: #fff;
        width: 100%;
        word-break: normal;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        padding: 8px 8px 15px 15px;
        border-radius: 8px;
        font-size: 16px;
        h2 {
          font-weight: bold;
          padding-top: 8px;
          transform: translate(20px, 15px);
        }
      }
    }
  }
}
.user-bgc {
  background-color: #f0f2f5 !important;
}

.chatting-input {
  position: fixed;
  padding: 10px;
  bottom: 2%;
  left: 29%;
  width: 922px;
  .input_witdh {
    width: 100%;
    margin: 5px auto 10px;
    .a-input-search {
      height: 40px;
    }
  }
}
</style>
