<template>
  <SettingDialog v-show="state.setDialog" />
  <div
    class="bg-dark"
    :class="state.setDialog ? 'active':''"
    @click="closeDialog"
  ></div>
  <div class="wrap-page">
    <!----------------------------------- 개발용 버튼 -------------------------------------->
    <p style="position:absolute; top:0;">
      <v-btn @click="clickTest">게임 시작 테스트</v-btn> |
      <v-btn @click="state.isTeamBattle = !state.isTeamBattle"
        >팀/개인전 변경</v-btn
      >
      <v-btn>게임 순서 변경</v-btn>
    </p>
    <!------------------------------------------------------------------------------------->



    <!-- 아래부터 대기방 페이지 관련 코드-->
    <div class="waiting-component" v-if="!readyAll">
      <div class="users-component">
        <p id="title">제목입니다</p>
        <WaitingPage
          :sessionId="state.sessionId"
          :playerList="state.playerList"
          :session="state.session"
          :myConnectionId="state.connectionId"
          :team="state.team"
        />
      </div>
      <div class="content-component">
        <ChattingBox class="box-chat"/>
        <div class="box-btn">
          <!-- <div class="box-blank"></div> --> <!-- 추후 업데이트 시 사용 예정 -->
          <button class="btn-ready" :class="state.ready?'ready':''" @click="clickReady">READY</button>
          <button class="btn-profile">내 프로필</button>
        </div>
      </div>
      <footer>
        <div class="inner-footer">
            <button class="btn-main" @click="clickExit">메인</button>
            <input class="notice" type="text" disabled value="notice">
            <button class="btn-store">상점</button>
            <button class="btn-set" @click="state.setDialog=!state.setDialog">설정</button>
        </div>
      </footer>
    </div>






<!-- 아래부터 게임 진행 페이지 관련 코드-->

    <div class="in_game_component" v-else>
      <RoundResult />
      <GameResult v-show="endGame"/>
      <GameTimer :key="gameTimer"/>
      <v-btn @click="forceRender">시계</v-btn>
      <h1>{{ round }} 라운드</h1>
      <GameScore />
      <v-container>
        <v-row>
          <v-col>
            <h1>상대 팀</h1>
            <user-video
              v-for="sub in opponents"
              :key="sub.stream.connection.connectionId"
              :stream-manager="sub"
            />
          </v-col>
          <v-col>
            <div id="video-container" class="col-md-6">
              <div class="me">
                <h1>나</h1>
                <div class="drawing_sec" v-if="!amIDescriber">
                  <MyCanvasBox />
                  <user-video :stream-manager="publisher" />
                </div>
                <div class="displaying_sec" v-else>
                  <user-video :stream-manager="publisher" />
                </div>
              </div>
              <div class="our_team">
                <h1>우리 팀</h1>
                <div class="drawing_sec" v-if="amIDescriber">
                  <user-video
                    v-for="opp in opponents"
                    :key="opp.stream.connection.connectionId"
                    :stream-manager="opp"
                  />
                  <MyCanvasBox />
                </div>
                <div class="displaying_sec" v-else>
                  <user-video
                    v-for="opp in opponents"
                    :key="opp.stream.connection.connectionId"
                    :stream-manager="opp"
                  />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- <div class="ingame_component_content">
      <div class="opponent_container">
        <user-video
          class="opp_stream"
          v-for="sub in opponents"
          :key="sub.stream.connection.connectionId"
          :stream-manager="sub"
          :class="
            sub.stream.connection.connectionId === currentPresenterId
              ? 'presenter'
              : ''
          "
        />
      </div>
      <div class="ourteam_container">
        <div class="me">
          <div class="draw_sec" v-if="!amIDescriber">
            <MyCanvasBox class="canvas" />
            <user-video :stream-manager="publisher" class="my_stream" />
          </div>
          <div class="display_sec" v-else>
            <user-video :stream-manager="publisher" class="my_stream" />
          </div>
        </div>
        <div class="ourteam_members">
          <div class="draw_sec" v-if="amIDescriber">
            <user-video
              v-for="sub in myTeams"
              :key="sub.stream.connection.connectionId"
              :stream-manager="sub"
              class="our_stream"
            />
            <MyCanvasBox class="canvas" />
          </div>
          <div class="display_sec" v-else>
            <user-video
              v-for="sub in myTeams"
              :key="sub.stream.connection.connectionId"
              :stream-manager="sub"
              class="our_stream"
            />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import GameTimer from "./components/GameTimer.vue";
import UserVideo from "./components/UserVideo.vue";
import MyCanvasBox from "./components/MyCanvasBox.vue";
import GameScore from "./components/GameScore.vue";
import WaitingPage from "@/views/WaitingPage/WaitingPage.vue";
import ChattingBox from "@/views/WaitingPage/components/ChattingBox.vue";
import RoundResult from "./components/RoundResult.vue";
import SettingDialog from "@/views/SettingDialog.vue"
import $axios from "axios";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { GetPlayerList } from "@/common/api/gameAPI";
import { reactive, ref } from "@vue/reactivity";
import { onBeforeMount, computed } from "vue";
import GameResult from "../InGamePage/components/GameResult.vue";


//=================OpenVdue====================
$axios.defaults.headers.post["Content-Type"] = "application/json";
//=============================================

export default {
  name: "InGamePage",
  components: {
    GameTimer,
    UserVideo,
    MyCanvasBox,
    WaitingPage,
    ChattingBox,
    GameScore,
    RoundResult,
    SettingDialog,
    GameResult,
  },
  props: {
    ready: Boolean,
  },
  setup() {
    const store = useStore();
    const route = useRoute(); // URL 파라미터를 통한 sessionId 얻기
    const userList = computed(() => store.state.gameStore.userList);
    const readyAll = computed(() => store.state.gameStore.isAllReady);
    const amIDescriber = computed(() => store.state.gameStore.amIDescriber);
    const round = computed(() => store.state.gameStore.round);
    const endGame = computed(() => store.state.gameStore.endGame);
    const currentPresenterId = computed(
      () => store.state.gameStore.presenterId
    );
    const router = useRouter();
    const state = reactive({
      title: null,
      isSecret: false,
      password: null,
      isTeamBattle: null,
      mainStreamManager: undefined,
      sessionId: route.params.sessionId || null,
      isHost: true,
      connectionId: null,
      nickname: computed(() => store.state.accountStore.user.nickname),

      // 팀 분류
      myTeam: null,
      opponentTeam: [],

      // 게임 순서 관련
      ready: false,
      team: null,

      // 모달 관련
      setDialog: false,

    });

    // == OpenVidu State ==
    const publisher = computed(() => store.state.gameStore.publisher);
    const myTeams = computed(() => store.getters["gameStore/getMyTeams"]);
    const opponents = computed(() => store.getters["gameStore/getOpponents"]);

    const joinSession = async function () {
      const players = await GetPlayerList(state.sessionId);
      console.log("players : ", players);
      // for (let i = 0; i < players.content.length; i++) {
      //   console.log(
      //     "접근 가능 여부 확인중.. ",
      //     players.content[i].player.nickname,
      //     state.nickname
      //   );
      //   if (players.content[i].player.nickname === state.nickname) {
      //     alert("잘못된 접근입니다.");
      //     router.push({ name: "main" });
      //     return;
      //   }
      // }
      store.commit("gameStore/setSessionId", state.sessionId); // 실행 전 세션id 저장 | 이은혁
      console.log("여기까지")
      await store.dispatch("gameStore/joinSession", state.sessionId);
      console.log("여기까지 완료")
    };
    const leaveSession = async function () {
      store.dispatch("gameStore/leaveSession");
      window.removeEventListener("beforeunload", leaveSession);
    };

    onBeforeMount(async () => {
      await store.dispatch("accountStore/getMeAction");
      console.log("join start");
      joinSession();
    });

    const updateMainVideoStreamManager = async function (stream) {
      store.dispatch("gameStore/updateMainVideoStreamManager", stream);
    };

    const clickExit = () => {
      store.dispatch("gameStore/leaveSession");
      router.push({
        name: "main",
      });
    };

    const clickReady = () => {
      console.log("ready")
      store.dispatch("gameStore/changeReady");
    };

    const clickTeam = (color) => {
      store.dispatch("gameStore/changeTeamAction", color);
    };

    const clickTest = () => {
      console.log("clickTest 클릭");
      store.dispatch("gameStore/changeTest", true);
      store.dispatch("gameStore/gameStart");
    };

    const gameStart = () => {
      store.dispatch("gameStore/gameStart");
    };
    const closeDialog = () => {
      state.setDialog = false;
    };

    const gameTimer = ref(0)

    const forceRender = function() {
      gameTimer.value += 1
    }
    return {
      router,
      state,
      readyAll,
      publisher,
      myTeams,
      opponents,
      amIDescriber,
      userList,
      round,
      currentPresenterId,
      endGame,
      clickExit,
      clickTest,
      clickReady,
      clickTeam,
      gameStart,
      joinSession,
      leaveSession,
      closeDialog,
      updateMainVideoStreamManager,
      gameTimer,
      forceRender
    };
  },
};
</script>

<style scoped>
/* ======= waiting_component ================================================================= */

.wrap-page {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 0;
}
.waiting-component {
  width: 800px;
  height: 550px;
  background: white;
  border-radius: 60px;
  padding:40px;
}
.users-component {
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background: #D9D9D9;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 25%);
}
.content-component {
  margin-top: 15px;
  height: 225px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.box-chat {
  width: 100%;
  height: 225px;
  background: #F9F9F9;
  border-radius: 30px;
  border: 1px solid #E6E6E6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.box-btn {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box-blank {
  width: 300px;
  height: 60px;
  margin-bottom: 15px;
  border-radius: 30px;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.25);
}
.box-btn>button {
  width: 170px;
  height: 70px;
  border-radius: 30px;
  margin: 7px 0;
  transition: 0.1s;
}
.box-btn>button:hover {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
}
.box-btn>button:active {
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.5);
}
.btn-ready {
  background: #24cb83;
  color: white;
  font-size: 25px;
}
.btn-ready:hover {
  background: #ddc300;
  font-size: 30px;
}
.btn-ready:active {
  background: #b49f00;
}
.btn-profile {
  background: #C6C6C6;
  color: white;
  font-size: 20px;
}
.btn-profile:hover {
  background: #b7b7b7;
  font-size: 25px;
}
.btn-profile:active {
  background: rgb(172, 172, 172);
}

#title {
  width: 100%;
  height: 20px;
  text-align: left;
  margin: 7px 20px;
}


/* ----------------------------------- */

.chat_box {
  flex: auto;
  border-radius: 30px;
  height: 500px;
  background-color: #ffffffeb;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 20px 30px;
}
/* =========================================================================================== */

/* ======= in_game_component ================================================================= */
.in_game_component {
  display: flex;
  flex-direction: column;
  width: 100vw;
}
.ingame_component_content {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}
.opponent_container,
.ourteam_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-width: 300px;
}
.display_sec {
  width: 100%;
}
.display_sec .my_stream {
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 0px 20px 0px #0000003b;
}
.draw_sec {
  position: relative;
}
.opp_stream {
  transition-duration: 0.3s;
  height: 225px;
  margin: 10px 0;
  width: 300px;
  border-radius: 43px;
  box-shadow: 0px 0px 20px 0px #0000005c;
}
.presenter {
  height: 315px;
  margin: 10px 0;
  width: 420px;
}
.draw_sec .my_stream {
  height: 100px;
  width: 100px;
  right: 10px;
  bottom: 10px;
  position: absolute;
  border-radius: 100px;
  overflow: hidden;
  box-shadow: 0px 0px 20px 0px #0000005c;
}
.canvas {
  width: 100%;
}
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
  background: #636363;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  padding: 10px;
}
.inner-footer>button, .inner-footer>.notice {
  padding: 3px 20px;
  margin: 0 10px;
  border-radius: 10px;
  height: 30px;
}
.btn-main {
  background: #e3ac00;
  color: white;
}
.notice {
  width: 400px;
  background: #4F4F4F;
  display: inline-block;
  padding: 3px 10px;
  color: white;
}
.btn-store, .btn-set {
  border: 1px solid #4B4B4B;
  color: #EFEDED;
}
/* =========================================================================================== */
</style>