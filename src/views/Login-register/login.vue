<template>
  <a-row class="layout" align="middle">
    <div class="login_form" hoverable>
      <div class="title">拓维医学系统登陆</div>
      <a-form
        class="form"
        ref="loginFormRef"
        layout="labelCol"
        :rules="loginRules"
        :model="loginForm"
      >
        <div class="input">
          <a-form-item label="账号:" name="username">
            <a-input
              v-model:value="loginForm.username"
              size="middle"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <div class="inputa">
          <a-form-item label="密码:" name="password">
            <a-input
              v-model:value="loginForm.password"
              size="middle"
              type="password"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <a-form-item>
          <a-button
            class="login"
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="onSubmit"
            >登录</a-button
          >
        </a-form-item>
        <a-button class="skip" type="link" @click="toRegister"
          >还没有账号，去注册</a-button
        >
      </a-form>
    </div>
  </a-row>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { post } from "../../request/request";
import "ant-design-vue/es/message/style/css";
import jwtDecode from "jwt-decode";
//表单的类型
interface formState {
  username: string;
  password: string;
}
export default defineComponent({
  name: "login",
  setup() {
    //表单的ref属性
    const loginFormRef = ref();
    const router = useRouter();
    let loading = ref<boolean>(false);

    //登录表单
    const loginForm: formState = reactive({
      username: "",
      password: "",
    });

    //登录验证规则
    const loginRules = {
      username: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        { min: 3, max: 18, message: "长度应该在3-18的范围内", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 3, max: 18, message: "长度应该在3-18的范围内", trigger: "blur" },
      ],
    };

    //提交表单
    const onSubmit = () => {
      loginFormRef.value
        .validate()
        .then(async () => {
          loading.value = true;
          try {
            const res: any = await post("/user/login", {
              username: loginForm.username,
              password: loginForm.password,
            });
            loading.value = false;
            if (res.code === 1) {
              message.success("欢迎登录");
              localStorage.setItem(
                "loginTime",
                new Date().getTime().toString()
              );
              localStorage.setItem("token", res.msg);
              const sub: any = jwtDecode(res.msg);
              const msg = JSON.parse(sub.sub);
              localStorage.setItem("type", msg.type);
              //0代表病人 1代表医生
              localStorage.setItem("id", msg.id);
              localStorage.setItem("name", msg.name);
              router.push({ name: "home" });
            } else {
              message.info(res.msg);
              loading.value = false;
            }
          } catch {
            message.info("请求失败");
            loading.value = false;
          }
        })
        .catch(() => {
          message.info("请输入完整");
          loading.value = false;
        });
    };

    //清空表单
    const resetForm = () => {
      loginFormRef.value.resetFields();
    };

    //跳转至注册
    const toRegister = async () => {
      router.push({ name: "register" });
      // let result: any = await get("/admin/api/v1/register/status", "");
      // if (result.status_code === 0) {
      //   router.push({ name: "register" });
      // } else {
      //   message.info("注册尚未开放");
      // }
    };

    return {
      loginFormRef,
      loading,
      loginForm,
      loginRules,
      onSubmit,
      toRegister,
      resetForm,
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
  },
});
</script>

<style lang="less" scoped>
.login_form {
  padding: 30px 30px 20px 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  width: 30%;
  z-index: 2;
  position: absolute;
  left: 42%;
  .form {
    width: 100%;
    margin-left: 10%;
    max-width: 250px;
  }
  .login {
    width: 80%;
    border-radius: 5px;
    margin-left: 10%;
  }
}
.title {
  color: #000;
  padding: 10px 0 20px 0;
  font-size: 29px;
  font-weight: bold;
}
.skip {
  position: relative;
  left: -5%;
}

.layout {
  height: 68vh;
}
</style>
