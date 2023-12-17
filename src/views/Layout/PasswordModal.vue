<template>
  <a-modal
    v-model:visible="visible"
    title="修改密码"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formState" :rules="rules">
      <a-form-item label="原来密码 " name="oldPassword">
        <a-input
          v-model:value="formState.oldPassword"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="新的密码 " name="password">
        <a-input
          v-model:value="formState.password"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="确认密码" name="checkPassword">
        <a-input
          v-model:value="formState.checkPassword"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { put, post } from "../../request/request";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { defineComponent, ref, UnwrapRef, reactive, Ref } from "vue";
import { message } from "ant-design-vue";

interface FormState {
  oldPassword: string;
  password: string;
  checkPassword: string;
}

const useFormEffect = () => {
  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    oldPassword: "",
    password: "",
    checkPassword: "",
  });
  let validatePass = async (rule: RuleObject, value: string) => {
    if (value === "") {
      return Promise.reject("请输入密码");
    } else {
      if (formState.checkPassword !== "") {
        formRef.value.validateFields("checkPass");
      }
      return Promise.resolve();
    }
  };
  let validatePass2 = async (rule: RuleObject, value: string) => {
    if (value === "") {
      return Promise.reject("请再次输入密码");
    } else if (value !== formState.password) {
      return Promise.reject("两次输入的密码不一致!");
    } else {
      return Promise.resolve();
    }
  };
  const rules = {
    oldPassword: [
      {
        required: true,
        message: "请输入原密码",
        trigger: "blur",
      },
    ],
    password: [{ required: true, validator: validatePass, trigger: "blur" }],
    checkPassword: [
      { required: true, validator: validatePass2, trigger: "blur" },
    ],
  };
  return { formState, formRef, rules };
};

const useModalEffect = (formState: UnwrapRef<FormState>, token: string) => {
  const visible = ref<boolean>(false);
  const showModal = () => {
    visible.value = true;
  };
  const handleCancel = () => {
    formState.oldPassword = "";
    formState.password = "";
    formState.checkPassword = "";
  };

  const { checkPass } = useHttpEffect(formState, token, visible);

  const handleOk = async () => {
    if (!Object.values(formState).some((value) => value == "")) {
      if (formState.password === formState.checkPassword) {
        await checkPass();
      }
    } else {
      message.warn("请填写完整！");
    }
  };
  return {
    visible,
    showModal,
    handleOk,
    handleCancel,
  };
};

const useHttpEffect = (
  formState: UnwrapRef<FormState>,
  token: string,
  visible: Ref<boolean>
) => {
  const checkPass = async () => {
    const res1: any = await post("/admin/api/v1/login", {
      username: localStorage.getItem("username"), //用户名
      password: formState.oldPassword,
    });
    console.log("object");
    if (res1?.data?.result === 0) {
      const res2: any = await put(
        "/admin/api/v1/admin/password",
        {
          id: 1,
          password: formState.password,
        },
        token
      );
      if (res2?.data?.result === 0) {
        message.info("修改成功");
        visible.value = false;
        formState.oldPassword = "";
        formState.password = "";
        formState.checkPassword = "";
      } else {
        message.error("修改失败");
      }
    } else {
      message.info("原来的密码输入错误，请重新输入");
      formState.oldPassword = "";
      formState.password = "";
      formState.checkPassword = "";
    }
  };
  return { checkPass };
};

export default defineComponent({
  setup() {
    const token: string = localStorage.getItem("msToken") as string;
    const { formState, formRef, rules } = useFormEffect();
    const { visible, showModal, handleOk, handleCancel } = useModalEffect(
      formState,
      token
    );

    return {
      visible,
      formState,
      formRef,
      rules,
      showModal,
      handleOk,
      handleCancel,
    };
  },
});
</script>
