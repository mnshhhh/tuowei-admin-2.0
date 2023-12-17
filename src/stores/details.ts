import { defineStore } from "pinia";
import { get } from "../request/request";

export const useDetailsStore = defineStore("details", {
  state: () => {
    return {
      id: null,
      name: "",
      age: 0,
      doctorId: 0,
      office: "",
      info: "",
      gender: "",
      report: "",
      comeDate: "",
      description: "",
    };
  },
  actions: {
    async getUserMes(url: string) {
      const userId = localStorage.getItem("id");
      const token: any = localStorage.getItem("token");
      try {
        const res: any = await get(url + userId, token);
        this.id = res.data.id;
        this.name = res.data.name;
        this.age = res.data.age;
        this.doctorId = res.data.doctorId;
        this.office = res.data.office;
        this.info = res.data.info;
        this.gender = res.data.gender;
        this.report = res.data.report;
        this.comeDate = res.data.comeDate;
        this.description = res.data.description;
        console.log(222, res);
      } catch {
        console.log("获取信息失败");
      }
    },
  },
});
