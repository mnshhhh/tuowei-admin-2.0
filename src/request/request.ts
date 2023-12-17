import axios from "axios";
// import jwtDecode from "jwt-decode";

//设置baseurl
// const baseUrl = "http://43.153.176.209:8080/";
const baseUrl = "";

export const post = (url: string, data = {}, token = "") => {
  if (token) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*", // 或指定允许访问的特定源
            token,
          },
        })
        .then(
          (response) => {
            resolve(response.data);
          },
          (err) => {
            reject(err);
          }
        );
    });
  } else {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*", // 或指定允许访问的特定源
          },
        })
        .then(
          (response) => {
            // console.log("成功登录", response.data);
            resolve(response.data);
            // if (response.data.code == 1) {
            //   const sub: any = jwtDecode(response.data.msg);
            //   const msg = JSON.parse(sub.sub);
            //   localStorage.setItem("type", msg.type);
            //   //0代表病人 1代表医生
            //   localStorage.setItem("id", msg.id);
            //   // localStorage.setItem("name", msg.name);
            // }
          },
          (err) => {
            console.log("请求失败", err);
            reject(err);
          }
        );
    });
  }
};

export const get = (url: string, token: string | null) => {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + url, {
        headers: { token },
      })
      .then(
        (response) => {
          resolve(response.data);
          // console.log(response.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
};

export const put = (url: string, data = {}, token: string) => {
  return new Promise((resolve, reject) => {
    axios
      .put(baseUrl + url, data, {
        headers: { "Content-Type": "application/json", Authorization: token },
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
  });
};

export const detele = (url: string, token: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(baseUrl + url, {
        headers: { token },
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
  });
};

export const upload = (url: string, data = {}, token: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          transformRequest: [(data) => data],
        },
      })
      .then(
        (response) => {
          // console.log('请求成功', response.data)
          resolve(response.data);
        },
        (err) => {
          // console.log('请求失败', err)
          reject(err);
        }
      );
  });
};
export const getStream = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then(
        (response) => {
          // console.log('请求成功', response.data)
          resolve(response.data);
        },
        (err) => {
          // console.log('请求失败', err)
          reject(err);
        }
      );
  });
};
