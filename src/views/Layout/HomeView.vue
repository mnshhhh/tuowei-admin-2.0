<template>
  <a-layout>
    <password-modal ref="RefChilde" />
    <a-layout-header
      class="box"
      :style="{
        position: 'fixed',
        background: '#fff',
        padding: '0',
        zIndex: 1,
        width: '100%',
      }"
    >
      <span class="box__left">
        <img class="img" src="https://s1.ax1x.com/2023/05/06/p9aHMYq.png" />
        <span class="box__left__big">拓维医学系统</span>
      </span>
      <a-popover class="box__right" trigger="hover">
        <template #content>
          <p>
            <a-button type="text" @click="updataPassword"
              ><user-outlined /> 修改密码</a-button
            >
          </p>
          <span
            ><a-button type="text" @click="goout" style="width: 100%">
              <logout-outlined /> 退出登录</a-button
            ></span
          >
        </template>
        <a-button class="right"><user-outlined />{{ username }}</a-button>
      </a-popover>
    </a-layout-header>

    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sider"
    >
      <div class="logo"></div>
      <a-menu theme="light" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="4">
          <template #icon>
            <BankFilled />
          </template>
          <router-link :to="{ name: 'HOME' }">首页</router-link>
        </a-menu-item>
        <a-sub-menu key="1" v-if="type == '0' || type == '1' ? true : false">
          <template #icon>
            <user-outlined />
          </template>
          <template #title>医学切割</template>
          <a-menu-item key="sub1">
            <!-- <user-outlined /> -->
            <router-link :to="{ name: 'details' }">
              {{
                name1 != null && name1
                  ? name1
                  : name2 != null && name2
                  ? name2
                  : "用户"
              }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          key="2"
          v-if="type == '0' || type == '1' ? true : false"
          @click="show = false"
        >
          <template #icon>
            <AlertOutlined />
          </template>
          <router-link :to="{ name: 'talk' }"
            >咨询
            <a-badge :dot="show" class="badge"> </a-badge>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3" v-if="type == '0' ? true : false">
          <template #icon>
            <CodeSandboxOutlined />
          </template>
          <router-link :to="{ name: 'AI' }">拓维智慧</router-link>
        </a-menu-item>
        <a-menu-item key="5" v-if="type == '2' ? true : false">
          <template #icon>
            <CodeSandboxOutlined />
          </template>
          <router-link :to="{ name: 'admin' }">人员管理</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px 10px 16px',
          // padding: '24px',
          // background: '#fff',
          minHeight: '87.8vh',
        }"
      >
        <ContenView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BankFilled,
  AlertOutlined,
  CodeSandboxOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import ContenView from "./ContenView.vue";
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  toRaw,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import PasswordModal from "./PasswordModal.vue";
import { useTalkStore } from "@/stores/talk";
import { storeToRefs } from "pinia";
import { useDetailsStore } from "@/stores/details";
export default defineComponent({
  components: {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BankFilled,
    AlertOutlined,
    CodeSandboxOutlined,
    LogoutOutlined,
    ContenView,
    PasswordModal,
  },
  setup() {
    const router = useRouter();
    const RefChilde = ref();
    const username = ref<string>(localStorage.getItem("username") as string);
    const detail = useDetailsStore();
    const { name } = storeToRefs(detail);
    let name1 = ref<string>("");
    watch(name, () => {
      name1.value = toRaw(name.value);
    });
    const name2 = localStorage.getItem("name");
    const goout = () => {
      window.sessionStorage.clear();
      window.localStorage.clear();
      router.push({ name: "login" });
      message.info("退出成功！");
    };
    const updataPassword = () => {
      RefChilde.value.showModal();
    };
    // 轮询新消息
    const store = useTalkStore();
    const { show } = storeToRefs(store);
    //动态显示
    let type = ref();
    let timer: any;
    onMounted(() => {
      console.log("name", name1);
      if (
        localStorage.getItem("type") &&
        localStorage.getItem("id") &&
        localStorage.getItem("token")
      )
        type.value = localStorage.getItem("type");
      else router.push({ name: "login" });
      if (type.value == "1" || type.value == "0") {
        timer = setInterval(() => {
          store.setCheck();
          console.log("轮询");
        }, 3000);
      }
    });
    onBeforeUnmount(() => {
      clearInterval(timer);
      timer = null;
    });
    return {
      RefChilde,
      updataPassword,
      username,
      goout,
      selectedKeys: ref<string[]>(["4"]),
      collapsed: ref<boolean>(false),
      type,
      show,
      name1,
      name2,
    };
  },
});
</script>
<style lang="less" scoped>
.trigger {
  font-size: 23px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 5%;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
span {
  font-size: 18px;
}
.sider {
  background: #fff !important;
}
.box {
  display: flex;
  box-shadow: 1px 1px 5px #c8c8c8;
  &__left {
    flex: 4;
    &__big {
      padding: 30px 0px 30px 25px;
      font-size: 20px;
    }
    &__small {
      color: #999;
      font-size: 12px;
      display: inline-block;
      transform: scale(0.9);
    }
  }
}
a-layout-sider {
  width: 400px;
}
.box__left {
  font-size: 22px;
  position: relative;
  top: -5px;
  left: 1%;
}
.box__left__big {
  font-size: 22px;
  position: relative;
  top: 3px;
}
.box__right {
  font-size: 18px;
  margin: 16px 50px 0 0;
}
.right {
  border: none;
}
.img {
  width: 50px;
}
.badge {
  font-size: 14px;
}
</style>
