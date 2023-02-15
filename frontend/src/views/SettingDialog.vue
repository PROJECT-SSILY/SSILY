<template>
  <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">볼륨 설정</div>
      <div class="text-caption">배경음악
        <v-switch
            prepend-icon="mdi-volume-high" 
            @click="clickBtn1"
            v-model="state.media"
            hide-details
            true-value="on"
            false-value="off"
            :label="`${state.media}`"
          ></v-switch>
      </div>
      <div class="text-caption">효과음
        <v-switch
          prepend-icon="mdi-volume-high" 
          v-model="state.alarm"
          hide-details
          true-value="on"
          false-value="off"
          :label="`${state.alarm}`"
        ></v-switch>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { reactive } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed, onMounted } from "@vue/runtime-core";

export default {
  setup() {
    const store = useStore();
		const media = computed(() => store.state.gameStore.media);
    const alarm = computed(() => store.state.gameStore.alarm);
    const state = reactive({
        media: undefined,
        alarm: undefined,
    });
    onMounted(()=>{
      if (media) {
        state.media = 'on'
      } else {
        state.media ='off'
      }
      if (alarm) {
        state.alarm = 'on'
      } else {
        state.alarm = 'off'
      }
    });
    const clickBtn1 = () => {
      if (state.media == 'on') {
        store.dispatch("gameStore/changeVolume1", false);
      } else {
        store.dispatch("gameStore/changeVolume1", true);
      }
    }
    const clickBtn2 = () => {
      if (state.alarm == 'on') {
        store.dispatch("gameStore/changeVolume2", false);
      } else {
        store.dispatch("gameStore/changeVolume2", true);
      }
    }
    return { store, state, media, alarm, onMounted, clickBtn1, clickBtn2 };
  },
};
</script>
  
<style scoped>
.text-caption {
  margin-bottom: 10px;
}

.dialog {
  padding: 50px 196px
}
</style>
  