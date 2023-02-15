<template>
  <SettingDialog v-show="state.setDialog" />
  <div
    class="bg-dark"
    :class="state.setDialog ? 'active':''"
    @click="closeDialog"
  ></div>
  <footer>
      <div class="inner-footer">
      <button class="btn-exit" @click="clickExit">메인으로</button>
      <div class="notice">
        <div class="track">
          <div class="content">건강하고 쾌적한 게임 환경 조성을 위해 상대방을 존중해주세요.</div>
        </div>
      </div>
           
      <button class="btn-set" @click="state.setDialog = !state.setDialog">
          설정
      </button>
      </div>
  </footer>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive } from '@vue/reactivity';
import SettingDialog from "@/views/SettingDialog.vue";
export default {
  name: "FooterBox",
  components: {
    SettingDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter(); 
    const state = reactive({
        setDialog: false
    })
    const closeDialog = () => {
      state.setDialog = false;
    };
    const clickExit = () => {
      store.dispatch("gameStore/leaveSession");
      router.push({
        name: "main",
      });
    };
    return {
        state,
        closeDialog,
        clickExit,
    };
  },
};
</script>

<style>
footer {
  width: 100%;
  height: 50px;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: center;
  z-index: 4;
}
.inner-footer {
  width: 800px;
  height: 50px;
  display: flex;
  background: #636363;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  padding: 10px;
  justify-content: center;
}
.inner-footer > button,
.inner-footer > .notice {
  padding: 3px 20px;
  margin: 0 10px;
  border-radius: 10px;
  height: 30px;
}
.btn-exit {
  background: #e3ac00;
  color: white;
}
.btn-exit:hover {
  background: #ffbf00;
}
.btn-exit.active {
  background: rgb(214, 160, 0);
}
.notice {
  width: 400px;
  position: relative;
  background: #4f4f4f;
  display: inline-block;
  color: #c2c2c2;
  overflow-x: hidden; 
  overflow-y: hidden; 
}
.btn-set {
  border: 1px solid #4b4b4b;
  color: #efeded;
}
.btn-set:hover {
  background: #787878;
}
.btn-set:active {
  background: #656565;
}

 /* 움직이는 안내판 */
/* .notice {font-size:60px; font-family:'Raleway',Sans-serif; font-weight:300; position: relative; width: 100%;max-width:100%; height: auto; padding:100px 0; overflow-x: hidden; overflow-y: hidden; } */
.notice .track {
  position: absolute; 
  white-space: nowrap;
  will-change: transform;
  animation: marquee 10s linear infinite; 
}
@keyframes marquee {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}

</style>