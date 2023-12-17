<template>
  <div>
    <a-form layout="inline" :model="formState" class="top flex">
      <a-col :span="13" :offset="3">
        <a-form-item label="用户姓名">
          <a-input
            v-model:value="formState.name"
            placeholder="Doctor's name"
            class="left"
          />
        </a-form-item>
      </a-col>
      <!-- <a-col :span="8" :offset="1">
        <a-form-item label="医生Id">
          <a-input
            v-model:value="formState.account"
            placeholder="Doctor's Id"
            class="left"
          />
        </a-form-item>
      </a-col> -->
      <a-col :span="4" :offset="2">
        <a-form-item>
          <a-button type="primary" @click="search">搜索</a-button>
        </a-form-item>
      </a-col>
    </a-form>
  </div>
  <div class="bottom">
    <a-row class="box1 flex">
      <a-col :span="4" :offset="1">用户管理</a-col>
      <a-col :span="5" :offset="3">
        <drawer />
        <a-tooltip class="new" @click="New">
          <template #title>刷新</template>
          <RetweetOutlined />
        </a-tooltip>
      </a-col>
    </a-row>
    <tableBody :searchName="searchName" />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type { UnwrapRef } from "vue";
import drawer from "./Drawer.vue";
import tableBody from "./Table.vue";
import { RetweetOutlined } from "@ant-design/icons-vue";
// import { message } from "ant-design-vue";
export default defineComponent({
  components: { drawer, tableBody, RetweetOutlined },
  setup() {
    const open = ref<boolean>(true);
    interface FormState {
      name: string;
    }
    const formState: UnwrapRef<FormState> = reactive({
      name: "",
    });
    const New = () => {
      location.reload();
    };
    let searchName = ref<string>();
    const search = () => {
      if (formState.name.trim()) searchName.value = formState.name;
    };
    return {
      formState,
      open,
      New,
      search,
      searchName,
    };
  },
});
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.top {
  width: 100%;
  height: 70px;
  border-bottom: 15px solid rgba(240, 242, 245);
  border-radius: 2px;
  .left {
    margin-left: 10px;
  }
}
.bottom {
  height: 100%;
  border-radius: 2px;
  .box1 {
    width: 100%;
    height: 70px;
    font-size: 21px;
    font-weight: bold;
    justify-content: space-between;
    .new {
      margin-left: 50px;
      transform: translateY(3px);
      :hover {
        color: rgb(24, 144, 255);
      }
    }
  }
}
</style>
