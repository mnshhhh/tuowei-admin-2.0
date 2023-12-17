<template>
  <a-row class="layout" align="middle">
    <div class="login_form" hoverable>
      <div class="title">拓维医学系统注册</div>
      <a-form
        class="form"
        ref="loginFormRef"
        layout="labelCol"
        :rules="loginRules"
        :model="loginForm"
      >
        <!-- <div class="input"> -->
        <!-- <a-form-item label="医/患者" name="sole">
            <a-select
              v-model:value="loginForm.sole"
              placeholder="请选择您的身份"
            >
              <a-select-option value="patient" labelAlign="center">
                患者</a-select-option
              >
              <a-select-option value="doctor" labelAlign="center">
                医生</a-select-option
              >
            </a-select>
          </a-form-item> -->
        <!-- <a-form-item label="真实姓名：" name="realname">
            <a-input v-model:value="loginForm.realname" size="middle" />
          </a-form-item> -->
        <!-- </div> -->
        <div class="inputa">
          <a-form-item label="账号:" name="username">
            <a-input
              style="width: 190px"
              v-model:value="loginForm.username"
              size="middle"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <div class="inputa">
          <a-form-item label="密码:" name="password">
            <a-input
              style="width: 190px"
              v-model:value="loginForm.password"
              size="middle"
              type="password"
              autocomplete="off"
            />
          </a-form-item>
        </div>
        <div class="input">
          <a-form-item label="再次输入：" name="password2">
            <a-input
              v-model:value="loginForm.password2"
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
            @click="onSubmit"
            :loading="loading"
            >注册</a-button
          >
        </a-form-item>
        <a-button class="skip" type="link" @click="toLogin"
          >已有账号，去登陆</a-button
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
import jwtDecode from "jwt-decode";
//表单的类型
interface formState {
  sole: string;
  username: string;
  password: string;
  // realname: string;
  password2: string;
}
export default defineComponent({
  name: "register",
  setup() {
    //表单的ref属性
    const loginFormRef = ref();
    const router = useRouter();
    let loading = ref<boolean>(false);

    //登录表单
    const loginForm: formState = reactive({
      sole: "",
      username: "",
      password: "",
      // realname: "",
      password2: "",
    });

    //登录验证规则
    const loginRules = {
      // sole: [
      //   {
      //     required: true,
      //     message: "请选择您的身份",
      //     trigger: "blur",
      //   },
      // ],
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        { min: 3, max: 18, message: "长度应该在3-18的范围内", trigger: "blur" },
      ],
      // realname: [
      //   {
      //     required: true,
      //     message: "请输入真实姓名",
      //     trigger: "blur",
      //   },
      //   { min: 2, max: 8, message: "长度应该在2-8的范围内", trigger: "blur" },
      // ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 5, max: 18, message: "长度应该在5-18的范围内", trigger: "blur" },
      ],
      password2: [
        {
          required: true,
          message: "请再次输入密码",
          trigger: "blur",
        },
      ],
    };

    //提交表单
    const onSubmit = () => {
      loginFormRef.value
        .validate()
        .then(async () => {
          if (loginForm.password === loginForm.password2) {
            loading.value = true;
            try {
              const result: any = await post("/user/registerPatient", {
                username: loginForm.username,
                password: loginForm.password,
                type: 0,
              });
              loading.value = false;
              if (result.code != 1) {
                message.error(result.msg);
              } else if (result.code == 1) {
                message.success(result.msg);
                try {
                  const res: any = await post("/user/login", {
                    username: loginForm.username,
                    password: loginForm.password,
                  });
                  loading.value = false;
                  if (res.code === 1) {
                    message.success("登录成功");
                    // localStorage.clear();
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
                    router.push({ name: "home" });
                  } else {
                    message.info(res.msg);
                    loading.value = false;
                  }
                } catch {
                  message.info("请求失败");
                  loading.value = false;
                }
                router.push({ name: "home" });
              }
            } catch {
              message.info("请求失败");
              loading.value = false;
            }
          } else {
            message.info("两次输入的密码不同");
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

    //回到登陆界面
    const toLogin = () => {
      router.push({ name: "login" });
    };

    return {
      loginFormRef,
      loading,
      loginForm,
      loginRules,
      toLogin,
      onSubmit,
      resetForm,
    };
  },
});
</script>

<style lang="less" scoped>
.login_form {
  padding: 10px 80px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  z-index: 2;
  position: absolute;
  left: 42%;
  .form {
    width: 100%;
    max-width: 300px;
  }
  .login {
    width: 60%;
    border-radius: 5px;
    margin: 10px 0 0 20px;
  }
}
.title {
  color: #000;
  padding: 10px 0 30px 20px;
  font-size: 29px;
  font-weight: bold;
}
.input {
  margin: -4px;
}
.inputa {
  position: relative;
  left: 15px;
}
.skip {
  position: relative;
}
.layout {
  height: 68vh;
}
</style>
