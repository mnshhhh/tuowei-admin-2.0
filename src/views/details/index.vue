<template>
  <div class="pad">
    <a-spin :spinning="spinning" tip="正在分割中...">
      <a-row :gutter="32" align="middle">
        <a-col :span="15">
          <div class="table">
            <a-descriptions
              title="个人信息"
              size="large"
              :bordered="true"
              :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
            >
              <a-descriptions-item
                :label="key"
                v-for="(value, key) in data"
                :key="key"
              >
                {{ value }}
              </a-descriptions-item>
            </a-descriptions>
            <a-button
              class="top"
              size="large"
              type="primary"
              shape="round"
              @click="showDrawer"
              >完善信息
            </a-button>
            <a-drawer
              title="Create a new account"
              :width="720"
              :visible="open"
              :body-style="{ paddingBottom: '80px' }"
              :footer-style="{ textAlign: 'right' }"
              @close="onClose"
              placement="right"
            >
              <a-form
                :model="form"
                :rules="rules"
                layout="vertical"
                ref="formRef"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="姓名" name="Fname">
                      <a-input
                        v-model:value="form.Fname"
                        placeholder="Please enter user name"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12" v-if="type == 0 ? 1 : 0">
                    <a-form-item label="性别" name="gender">
                      <a-select
                        v-model:value="form.Fgender"
                        placeholder="Please choose the gender"
                      >
                        <a-select-option value="男">男</a-select-option>
                        <a-select-option value="女">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16" v-if="type == 0 ? 1 : 0">
                  <a-col :span="12">
                    <a-form-item label="年龄" name="age">
                      <a-input
                        v-model:value="form.Fage"
                        placeholder="Please enter your age"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12" v-if="type == 0 ? 1 : 0">
                    <a-form-item label="基本病情" name="info">
                      <a-input
                        v-model:value="form.Finfo"
                        placeholder="Please enter the info"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16" v-if="type == 0 ? 1 : 0">
                  <a-col :span="12">
                    <a-form-item label="医生Id" name="doctorId">
                      <a-input
                        v-model:value="form.FdoctorId"
                        placeholder="Please enter the doctorId"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="就诊科室" name="office">
                      <a-select
                        v-model:value="form.Foffice"
                        placeholder="Please choose the office"
                      >
                        <a-select-option value="内科">内科</a-select-option>
                        <a-select-option value="外科">外科</a-select-option>
                        <a-select-option value="妇产科">妇产科</a-select-option>
                        <a-select-option value="其他科">其他科</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16" v-if="type == 0 ? 1 : 0">
                  <a-col :span="12">
                    <a-form-item label="就诊日期" name="comedate">
                      <a-date-picker
                        v-model:value="form.FcomeDate"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16" v-if="type == 0 ? 1 : 0">
                  <a-col :span="24">
                    <a-form-item label="详细病情描述" name="description">
                      <a-textarea
                        v-model:value="form.Fdescription"
                        :rows="4"
                        placeholder="please enter your description"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <template #extra>
                <a-space>
                  <a-button @click="onClose">取消</a-button>
                  <a-button type="primary" @click="onSubmit">提交</a-button>
                </a-space>
              </template>
            </a-drawer>
          </div>
        </a-col>
        <a-col :span="4">
          <!-- <div class="upload">
            <a-upload
              :multiple="true"
              type="file"
              :file-list="fileList"
              id="fileInput"
              @change="handleChange"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                Upload
              </a-button>
            </a-upload>
          </div>
          <div class="buttom">
            <button @click="uploadImage">进行分割</button>
          </div>
          <div>
            <img
              :src="imgUrl"
              alt="请重新加载"
              class="imgShow"
              v-show="imgUrl"
            />
          </div> -->
          <div class="clearfix">
            <a-upload
              :file-list="fileList"
              :before-upload="beforeUpload"
              @remove="handleRemove"
              :max-count="1"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                选择图片
              </a-button>
            </a-upload>
            <a-button
              type="primary"
              :loading="uploading"
              style="margin-top: 16px"
              @click="handleUpload"
            >
              {{ uploading ? "切割中" : "医学切割" }}
            </a-button>
          </div>
          <div style="margin-top: 20px; width: 400px; height: 400px">
            <img
              :src="labelImg"
              alt=""
              style="width: 399px; height: 399px"
              :key="imgNew"
              v-if="labelImg != undefined"
            />
          </div>
        </a-col>
        <!-- <a-col :span="4">
          <div class="img">
            <a-image
              :width="480"
              src="https://s1.ax1x.com/2023/05/06/p9a2Z1s.png"
            />
          </div>
          <a-button
            class="but"
            size="large"
            type="primary"
            :loading="isloading"
            shape="round"
            @click="change"
            >进行分割
          </a-button>
        </a-col> -->
      </a-row>
    </a-spin>
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useDetailsStore } from "@/stores/details";
import { storeToRefs } from "pinia";
import type { Rule } from "ant-design-vue/es/form";
import { post } from "@/request/request";
import type { UploadProps } from "ant-design-vue";
// import { UploadOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  setup() {
    const token: any = localStorage.getItem("token");
    const type: any = localStorage.getItem("type");
    const fileList = ref();
    const uploading = ref<boolean>(false);
    let router = useRouter();
    let isloading = ref(false);
    let spinning = ref(false);
    const imgNew = ref(0);
    const labelImg = ref();
    const change = function () {
      isloading.value = true;
      spinning.value = true;
      setTimeout(() => {
        isloading.value = false;
        router.push({ name: "after" });
        message.success("分割成功");
      }, 1000);
    };
    //获取个人信息
    const store = useDetailsStore();
    const {
      id,
      name,
      age,
      doctorId,
      office,
      info,
      gender,
      report,
      comeDate,
      description,
    } = storeToRefs(store);
    let data = reactive({});
    if (type == 0) {
      data = reactive({
        id,
        name,
        age,
        doctorId,
        office,
        info,
        gender,
        report,
        comeDate,
        description,
      });
    } else if (type == 1) {
      data = reactive({
        id,
        name,
      });
    }
    onMounted(() => {
      let token = localStorage.getItem("token");
      let type: any = localStorage.getItem("type");
      let urls = "";
      if (token && type) {
        if (type == 0) urls = "/patient/getInfo?id=";
        else if (type == 1) urls = "/doctor/getInfo?id=";
        store.getUserMes(urls);
      }
    });
    // const handleChange = (info: UploadChangeParam) => {
    //   fileList.value[0] = info.file;
    // };
    //修改个人信息-抽屉
    interface formState {
      Fid: number;
      Fname: string;
      Fage: number;
      FdoctorId: number;
      Foffice: string;
      Finfo: string;
      Fgender: string;
      Freport: string;
      FcomeDate: string;
      Fdescription: string;
    }
    const userId: any = localStorage.getItem("id");
    const form: formState = reactive({
      Fid: userId,
      Fname: "",
      Fage: 0,
      FdoctorId: 0,
      Foffice: "",
      Finfo: "",
      Fgender: "",
      Freport: "",
      FcomeDate: "",
      Fdescription: "",
    });
    const rules: Record<string, Rule[]> = {
      Fname: [
        {
          required: true,
          message: "Please enter user name",
          trigger: "blur",
        },
      ],
      Fid: [
        {
          required: true,
          message: "Please enter user id",
          trigger: "blur",
        },
      ],
    };
    const open = ref<boolean>(false);
    const showDrawer = () => {
      if (type == 0) {
        open.value = true;
        form.Fname = name.value;
        form.Fage = age.value;
        form.FdoctorId = doctorId.value;
        form.Foffice = office.value;
        form.Finfo = info.value;
        form.Fgender = gender.value;
        form.Freport = report.value;
        form.FcomeDate = comeDate.value;
        form.Fdescription = description.value;
      } else if (type == 1) {
        open.value = true;
        form.Fname = name.value;
      }
    };
    const onClose = () => {
      open.value = false;
      message.info("关闭修改");
      console.log(form.Fid);
    };
    const formRef = ref();
    let url: string;
    const onSubmit = () => {
      // open.value = false;
      formRef.value
        .validate()
        .then(async () => {
          if (type == 0) url = "/patient/savePatient";
          else if (type == 1) url = "/doctor/saveDoctor";
          try {
            let upData = {};
            if (type == 0) {
              upData = {
                id: userId,
                name: form.Fname,
                office: form.Foffice,
                doctorId: form.FdoctorId,
                info: form.Finfo,
                gender: form.Fgender,
                description: form.Fdescription,
                age: form.Fage,
                comeDate: form.FcomeDate,
              };
            } else if (type == 1) {
              upData = {
                id: userId,
                name: form.Fname,
              };
            }
            const res: any = await post(url, upData, token);
            if (res.code === 1) {
              message.success("修改成功");
              localStorage.setItem("id", form.Fid.toString());
              localStorage.setItem("name", form.Fname.toString());
              let urlss = "";
              if (type == 0) urlss = "/patient/getInfo?id=";
              else if (type == 1) urlss = "/doctor/getInfo?id=";
              store.getUserMes(urlss);
              open.value = false;
            } else {
              message.info(res.msg);
            }
          } catch {
            message.error("修改信息失败");
          }
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    };
    const imgUrl = ref("");
    console.log(111, fileList.value);
    function uploadImage() {
      if (fileList.value) {
        const file = fileList.value[0];
        // console.log(11222, file);
        const formData = new FormData();
        formData.append("file", file);

        fetch("http://localhost:6868/siaunet", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            //未知得到的照片
            imgUrl.value =
              "data:image/jpeg;base64," + arrayBufferToBase64(data);
            console.log(data); // 可根据需要处理响应数据
          })
          .catch((error) => {
            console.error("上传图片出错:", error);
          });
      } else return;
    }
    const arrayBufferToBase64 = (buffer: Iterable<number>) => {
      //第一步，将ArrayBuffer转为二进制字符串
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      //将二进制字符串转为base64字符串
      return window.btoa(binary);
    };
    const handleRemove: UploadProps["onRemove"] = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      fileList.value = [...(fileList.value || []), file];
      return false;
    };

    const handleUpload = () => {
      const formData = new FormData();
      // fileList.value.forEach((file: UploadProps["fileList"]) => {
      //   formData.append("files[]", file as any);
      // });
      formData.append("file[]", fileList.value[0]);
      uploading.value = true;
      console.log(5557, fileList.value[0]);
      console.log(999, formData.get("file[]"));
      ++imgNew.value;
      // console.log(555, imgNew.value);
      // console.log(88, labelImg.value);

      // You can use any AJAX library you like
      fetch("http://localhost:6868/siaunet", {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          //未知得到的照片
          imgUrl.value = "data:image/jpeg;base64," + arrayBufferToBase64(data);
          console.log(data); // 可根据需要处理响应数据
        })
        // .then((res) => res.blob())
        // .then((blob) => {
        //   fileList.value = [];
        //   labelImg.value = URL.createObjectURL(blob);
        //   console.log(labelImg.value);
        //   uploading.value = false;
        //   message.success("upload successfully.");
        // })
        .catch(() => {
          uploading.value = false;
          message.error("upload failed.");
        });
    };
    return {
      isloading,
      change,
      spinning,
      data,
      form,
      showDrawer,
      onClose,
      onSubmit,
      rules,
      open,
      formRef,
      type,
      fileList,
      uploadImage,
      // handleChange,
      imgUrl,
      uploading,
      handleRemove,
      beforeUpload,
      handleUpload,
      labelImg,
      imgNew,
    };
  },
});
</script>
<style lang="less" scoped>
/* .img {
  position: relative;
  top: -30px;
  left: 59%;
}
.table {
  position: absolute;
  top: -10%;
  left: -27%;
}
.but {
  position: relative;
  left: 640px;
  top: -10px;
} */
.table {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .top {
    margin-top: 20px;
  }
}

.pad {
  padding: 20px;
}

.img {
  margin-top: 20px;
  width: 480px;
  height: 540px;
}

.but {
  margin-top: 20px;
  transform: translateX(190px);
}
.upload {
  height: 70px;
}
.buttom {
  height: 30px;
}
.imgShow {
  margin-top: 20px;
  width: 400px;
  height: 400px;
}
.clearfix {
  height: 150px;
}
</style>
