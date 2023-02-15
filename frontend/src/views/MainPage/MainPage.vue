<template>
  <div class="background">
    <div id="stars" class="rotating"></div>
  </div>
  <div class="wrap-page">
    <MakeRoomDialog v-show="state.roomDialog" />
    <TutorialDialog v-show="state.tutorDialog" />
    <SettingDialog v-show="state.settingDialog"/>
    <div
      class="bg-dark"
      :class="state.settingDialog || state.tutorDialog || state.roomDialog ? 'active':''"
      @click="closeDialog"
    ></div>
    <main>
      <button @click="state.settingDialog = true" id="ico-volume"><v-img src="@/assets/images/volume.svg" alt="volume"/></button>
      <section>
        <!-- 대기방 리스트 -->
        <div class="wrap-roomlist">
          <RoomList />
        </div>
      </section>
      <aside>
        <!-- 게임 관련 버튼 그룹 및 마이페이지 -->
        <div class="sec-myinfo">
          <router-link :to="{ name: 'mypage' }" class="btn-mypage">
            <v-img src="@/assets/images/rocket.png" alt="rocket" id="rocket" />
            {{ state.nickname }} 님
            </router-link>
        </div>
        <alert-dialog v-if="state.alert"/>
        <div class="sec-btn">
          <button @click="state.roomDialog = !state.roomDialog">방 만들기</button>
          <button @click="randomPrivate">바로 입장</button>
          <button @click="state.tutorDialog = !state.tutorDialog">튜토리얼</button>
        </div>
      </aside>
    </main>
  </div>
</template>
<script>
import MakeRoomDialog from "./Components/MakeRoomDialog.vue";
import SettingDialog from "../SettingDialog.vue";
import TutorialDialog from "./Components/TutorialDialog.vue";
import RoomList from "./Components/RoomList.vue";
import AlertDialog from '../AlertDialog.vue'
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, reactive, onMounted } from "vue";


export default {
  name: "MainPage",
  components: {
    MakeRoomDialog,
    TutorialDialog,
    SettingDialog,
    RoomList,
    AlertDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter(); 
    const state = reactive({
      isTeam: null,
      roomDialog: false,
      tutorDialog: false,
      settingDialog: false,
      nickname: computed(() => store.getters["accountStore/getUser"].nickname),
      alert: false
    });

    const closeDialog = () => {
      state.roomDialog = false;
      state.tutorDialog = false;
      state.settingDialog = false;
    };

    const randomPrivate = async function () {
      const response = await store.dispatch('gameStore/randomPrivateAction')
      console.log('response : ', response.status)
      if (response == -404) {
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '바로 입장 가능한 방이 없습니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return;
      } else if (response == -400){
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '이미 가득 찬 방입니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return;
      } else if (response == -401){
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '이미 게임이 진행중인 방입니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return;
      } else {
      router.push({
        name: "gameroom",
        params: { sessionId: response.data.sessionId },
      });
    }
    };

    onMounted(() => {
        store.dispatch('accountStore/getMeAction') // 메인페이지에서 닉네임 사라지지 않도록 처리
        store.dispatch("gameStore/leaveSession");
        store.commit("gameStore/setInGame", false)
        
      }
    )

    return {
      store,
      router,
      state,
      closeDialog,
      randomPrivate,
    };
  },
};
// }
</script>

<style scoped>
.wrap-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
main {
  display: flex;
  flex-direction: row;
  width: 800px;
  height: 500px;
  align-items: flex-end;
}
section {
  width: 500px;
  margin-right: 15px;
}
.wrap-roomlist {
  height: 500px;
  padding-top: 50px;
  position: relative;
}
aside {
  width: 300px;
  margin-left: 15px;
  height: 500px;
  background: white;
  border-radius: 60px;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 0px 50px #0000005c;
}
.sec-myinfo {
  height: 110px;
  width: 100%;
  background: #d3d3d3;
  border-bottom-right-radius: 55px;
  box-shadow: inset 0px -4px 10px #0000003d;
  padding: 13px;
}
#rocket {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 23px;
  left: 21px;
  transition: 0.2s;
}
#rocket:hover {
  top:20px;
  left: 12px;
  width: 105px;
  height: 105px;
}
.btn-mypage {
  height: 100%;
  width: 100%;
  background: white;
  display: inline-block;
  border-radius: 60px;
  box-shadow: 0 0 10px #0000003d;
  text-decoration: none;
  color: black;
  font-size: 18px;
  font-weight: 500;
  padding: 30px 20px 30px 100px;
  text-align: center;
}
.btn-mypage:hover {
  background: rgb(252, 252, 252);
  box-shadow: inset 1px 3px 3px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.btn-mypage:active {
  background: rgb(245, 245, 245);
  box-shadow: inset 1px 3px 4px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.sec-btn {
  height: 300px;
  margin: 79px 10px 10px 10px;
  box-sizing: border-box;
  border: 10px solid #c6c6c6;
  border-radius: 55px;
  overflow: hidden;
}
.sec-btn > button {
  background: #24cb83;
  color: white;
  text-shadow: 0 0 10px #00000080;
  width: 100%;
  height: 94px;
  display: block;
  text-align: center;
  font-size: 25px;
  border-bottom: 2px solid #0000001c;
}
.sec-btn > button:hover {
  background: #25d388;
}
.sec-btn > button:active {
  background: #1fae70;
}
</style>