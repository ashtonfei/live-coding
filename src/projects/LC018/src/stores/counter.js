import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { request } from "../utils";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment(amount) {
    count.value += amount;
  }

  // function decrement(amount) {
  //   count.value -= amount;
  // }
  async function submit() {
    const payload = {
      count: count.value,
    };
    console.log(payload);
    const result = await request("apiSetCount", payload);
    console.log(result);
  }
  return { count, doubleCount, increment, submit };
});
