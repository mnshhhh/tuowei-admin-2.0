import { get } from "@/request/request";
import { defineStore } from "pinia";

export const useTalkStore = defineStore("talk", {
  state: () => ({
    dataNew: [],
    show: false,
    dataShow: false,
  }),
  actions: {
    checked() {
      this.show != this.show;
      // console.log("tranShow", this.show);
    },
    async setCheck() {
      try {
        const token: any = localStorage.getItem("token");
        const id: any = localStorage.getItem("id");
        const res: any = await get("/message/isHaveRead?userId=" + id, token);
        // console.log("xinxiaoxi", res);
        if (res.code == 1) {
          if (res.data) {
            this.dataNew = res.data;
            this.show = true;
            this.dataShow = true;
          }
        }
      } catch {
        console.log("查询新消息失败");
      }
    },
  },
});
