// stores/counter.ts admin
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    form: {
      key: "",
      name: "",
      id: "",
      account: "",
      tags: ["doctor"],
    },
  }),
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count = 1;
    },
    reduce() {
      this.count = 0;
    },
  },
});
