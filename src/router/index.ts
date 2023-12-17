import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/Layout/HomeView.vue";
import Details from "../views/details/index.vue";
import After from "../views/after/index.vue";
import Talk from "../views/talk/index.vue";
import TalkView from "../views/talk/details/talkView.vue";
import Ai from "../views/AI/index.vue";
import Admin from "../views/admin/index.vue";
import Home from "../views/home/index.vue";
import { message } from "ant-design-vue";

const routes: Array<RouteRecordRaw> = [
  // 登录
  {
    path: "/",
    name: "Login-register",
    component: () => import("../views/Login-register/index.vue"),
    redirect: "/login",
    meta: {
      title: "登录",
    },
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("../views/Login-register/login.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("../views/Login-register/register.vue"),
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    redirect: "/HOME",
    component: HomeView,
    children: [
      {
        path: "/details",
        name: "details",
        component: Details,
      },
      {
        path: "/after",
        name: "after",
        component: After,
      },
      {
        path: "/HOME",
        name: "HOME",
        component: Home,
      },
      {
        path: "/talk",
        name: "talk",
        redirect: "/talkView",
        component: Talk,
        children: [
          {
            path: "/talkView",
            name: "talkView",
            component: TalkView,
          },
        ],
      },
      {
        path: "/AI",
        name: "AI",
        component: Ai,
      },
      {
        path: "/admin",
        name: "admin",
        component: Admin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  if (
    // (from.path == "/login" && to.path == "/register") ||
    // (from.path == "/register" && to.path == "/login")
    from.path == "/login" ||
    from.path == "/register"
  )
    next();
  else {
    if (token && type) {
      // message.info("用户已登录");
      switch (to.fullPath) {
        case "/details":
          if (type == "2") router.push({ name: "login" });
          break;
        case "/AI":
          if (type == "2" || type == "1") router.push({ name: "login" });
          break;
        case "/talkView":
          if (type == "2") router.push({ name: "login" });
          break;
        case "/admin":
          if (type == "1" || type == "0") router.push({ name: "login" });
          break;
        default:
          next();
          break;
      }
      next();
    } else {
      message.info("用户未登录");
      //跳转判断放在HomeView.vue模块里面
      // if(to != "/login") router.push({ name: "login" });
      next();
    }
  }
});

export default router;
