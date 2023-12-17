<template>
  <a-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    新建用户
  </a-button>
  <a-drawer
    title="为医生创建账号"
    :width="720"
    v-model:visible="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
    placement="right"
    class="drawer"
  >
    <a-form :model="form" :rules="rules" layout="vertical" ref="formRef">
      <a-row :gutter="16">
        <a-col :span="12" :offset="1">
          <a-form-item label="医生姓名" name="name">
            <a-input
              v-model:value="form.name"
              placeholder="Please enter doctor's name"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12" :offset="1">
          <a-form-item label="账号" name="account">
            <a-input
              v-model:value="form.account"
              placeholder="Please enter doctor's account"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12" :offset="1">
          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="form.password"
              placeholder="Please enter doctor's password"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12" :offset="1">
          <a-form-item label="请再次输入密码" name="password2">
            <a-input-password
              v-model:value="form.password2"
              placeholder="Please enter doctor's password2"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #extra>
      <a-space class="right">
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit" class="input">提交</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
// import { post } from "../../request/request";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import { get, post } from "@/request/request";
const formRef = ref();
interface formState {
  name: string;
  account: null;
  password: null;
  password2: null;
}
const form: formState = reactive({
  name: "",
  account: null,
  password: null,
  password2: null,
});
const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: "Please enter doctor's name",
    },
  ],
  account: [
    {
      required: true,
      message: "Please enter doctor's account",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter doctor's password",
    },
  ],
  password2: [
    {
      required: true,
      message: "Please enter again",
    },
  ],
};
const open = ref<boolean>(false);
const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  form.name = "";
  form.account = null;
  form.password = null;
  form.password2 = null;
  open.value = false;
  message.info("关闭创建");
  // formRef.value.resetFields();
};
const token: any = localStorage.getItem("token");
//提交表单
const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      if (form.password === form.password2) {
        try {
          const result: any = await post(
            "/user/register",
            {
              username: form.account,
              password: form.password,
              type: 1,
            },
            token
          );
          console.log(form);
          message.success(result.msg);
          if (result.code == 1) {
            try {
              const ress: any = await get(
                "/user/list?page=1&pageSize=100&username=" + form.account,
                token
              );
              console.log("ress", ress);
              try {
                const resss: any = await post(
                  "/doctor/saveDoctor",
                  {
                    name: form.name,
                    id: ress.data.records[0].id,
                  },
                  token
                );
                console.log("resss");
                message.info(resss.msg);
              } catch {
                message.info("命名失败，请重试");
              }
            } catch {
              message.info("请求id失败，请重试");
            }
            location.reload();
          }
        } catch {
          message.info("请求失败");
        }
        formRef.value.resetFields();
      } else {
        message.info("两次输入的密码不同");
      }
    })
    .catch(() => {
      message.info("请输入完整");
    });
  open.value = true;
};
</script>
<style>
.drawer {
  height: 100%;
  z-index: 100;
}
.right {
  margin-right: 30px;
  .input {
    margin-left: 10px;
  }
}
</style>
