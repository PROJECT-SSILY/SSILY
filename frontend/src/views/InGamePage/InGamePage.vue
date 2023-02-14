<template>
  <div class="wrap-page">
    <FooterBoxVue v-if="!inGame"/>
    <!----------------------------------- 개발용 버튼 -------------------------------------->
    <p style="position: absolute; top: 0; opacity: 0.2; z-index: 3">
      <v-btn @click="clickTest">게임 시작 테스트</v-btn> |
      <v-btn @click="state.isTeamBattle = !state.isTeamBattle"
        >팀/개인전 변경</v-btn
      >
      <v-btn>게임 순서 변경</v-btn>
      <v-btn @click="forceRender">시계</v-btn>
    </p>
    <!------------------------------------------------------------------------------------->

    <!-- 아래부터 대기방 페이지 관련 코드-->
    <div class="component-waiting" v-if="!inGame">
      <div class="users-component">
        <p id="title">{{state.title}}</p>
        <WaitingPage
          :sessionId="state.sessionId"
          :playerList="state.playerList"
          :session="state.session"
          :myConnectionId="state.connectionId"
          :team="state.team"
        />
        <StartTimer v-if="state.startTimer"/>
      </div>
      <div class="content-component">
        <ChattingBox class="box-chat" />
        <div class="box-btn">
          <!-- <div class="box-blank"></div> -->
          <!-- 추후 업데이트 시 사용 예정 -->
          <button
            class="btn-ready"
            :class="state.ready ? 'active' : ''"
            @click="clickReady"
          >
            READY
          </button>
          <button class="btn-profile">내 프로필</button>
        </div>
      </div>

      <!-- 배경 -->
      <div class="background">
        <div id="stars" class="rotating"></div>
      </div>
    </div>

    <!-- 아래부터 게임 진행 페이지 관련 코드-->
    <div class="component-ingame" v-else>
      <header>
        <GameTimer :key="gameTimer" id="timer" />
      </header>
      <p class="gameround">{{ round }} 라운드</p>
      <RoundResult />
      <GameResult v-show="endGame"/>
      <GameScore class="gamescore"/>

      <!-- 상대 팀 -->
      <div class="area-opponents">
        <user-video
          class="stream-opponent"
          v-for="sub in opponents"
          :key="sub.stream.connection.connectionId"
          :stream-manager="sub"
          :class="sub.stream.connection.connectionId === currentPresenterId ? 'presenter': ''"/>
      </div>
      <!-- 우리 팀 -->
      <div class="area-ourteam">
        <div class="me">
          <div class="sec-draw" v-if="!amIDescriber">
            <MyCanvasBox class="canvas" />
            <user-video :stream-manager="publisher" class="stream-me" />
          </div>
          <div class="sec-display" v-else>
            <div id="word">
              <p>제시어 : {{ word }}</p>
              </div>
            <user-video :stream-manager="publisher" class="stream-me" />
          </div>
          <div class="wrap-robot" v-if="!amIDescriber">
            <v-img id="robot" :src="state.robot" alt="robot" />
          </div>
        </div>
        <!-- <div class="ourteam-members">
          <div class="sec-draw" v-if="!amIDescriber">
            <user-video
              v-for="sub in myTeams"
              :key="sub.stream.connection.connectionId"
              :stream-manager="sub"
              class="our-stream"
            />
            <MyCanvasBox class="canvas" />
          </div>
          <div class="sec-display" v-else>
            <user-video
              v-for="sub in myTeams"
              :key="sub.stream.connection.connectionId"
              :stream-manager="sub"
              class="our-stream"
            />
          </div>
        </div> -->
      </div>
      <footer></footer>
      
      <div id="toast"></div>
      <!-- 배경 -->
      <div class="background-ingame"></div>
    </div>
  </div>
</template>

<script>
import UserVideo from "./components/UserVideo.vue";
import MyCanvasBox from "./components/MyCanvasBox.vue";
import WaitingPage from "@/views/WaitingPage/WaitingPage.vue";
import ChattingBox from "@/views/WaitingPage/components/ChattingBox.vue";
import $axios from "axios";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { GetPlayerList } from "@/common/api/gameAPI";
import { reactive, ref } from "@vue/reactivity";
import { onBeforeMount, computed, watch } from "vue";
import GameTimer from "./components/GameTimer.vue";
import GameScore from "./components/GameScore.vue";
import RoundResult from "./components/RoundResult.vue";
import GameResult from "../InGamePage/components/GameResult.vue";
import StartTimer from "@/views/InGamePage/components/StartTimer.vue"
import FooterBoxVue from '../MainPage/Components/FooterBox.vue';
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
    GameResult,
    StartTimer,
    FooterBoxVue,
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
    const word = computed(() => store.state.gameStore.word);
    const round = computed(() => store.state.gameStore.round);
    const endGame = computed(() => store.state.gameStore.endGame);
    const endRound = computed(() => store.state.gameStore.endRound);
    const inGame = computed(() => store.state.gameStore.inGame); 
    const currentPresenterId = computed(
      () => {
        /**
         * 토스트 실행
         * 신대득
         */
        if(store.state.gameStore.presenterId!=""){
          excuteToast(store.state.gameStore.presenterId);
        }
        return store.state.gameStore.presenterId
      }
    );
    const router = useRouter();
    const state = reactive({
      title: computed(() => store.state.gameStore.title ),
      isSecret: false,
      password: null,
      isTeamBattle: null,
      mainStreamManager: undefined,
      sessionId: route.params.sessionId || null,
      isHost: true,
      connectionId: null,
      nickname: computed(() => store.state.accountStore.user.nickname),
      level: computed(() => store.state.accountStore.user.level),
      robot: null,
      startTimer: false,

      // 팀 분류
      myTeam: null,
      opponentTeam: [],

      // 게임 순서 관련
      ready: false,
      team: null,
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
      console.log("여기까지");
      await store.dispatch("gameStore/joinSession", state.sessionId);
      console.log("여기까지 완료");
    };
    const leaveSession = async function () {
      store.dispatch("gameStore/leaveSession");
      window.removeEventListener("beforeunload", leaveSession);
    };

    onBeforeMount(async () => {
      await store.dispatch("accountStore/getMeAction");
      console.log("join start");
      if (state.level > -1 && state.level < 6)  {
          state.robot = "../ssily1.svg"
      } else if (state.level > 5 && state.level < 11) {
          state.robot = "../ssily2.svg"
      } else {
          state.robot = "../ssily3.svg"
      }

      joinSession();
    });

    const updateMainVideoStreamManager = async function (stream) {
      store.dispatch("gameStore/updateMainVideoStreamManager", stream);
    };

    const clickReady = () => {
      console.log("ready");
      state.ready = !state.ready
      store.dispatch("gameStore/changeReady");
    };

    const clickTeam = (color) => {
      store.dispatch("gameStore/changeTeamAction", color);
    };

    const gameStart = () => {
      store.dispatch("gameStore/gameStart");
    };

    const gameTimer = ref(0);

    const forceRender = function () {
      gameTimer.value += 1;
    };

    /**
     * 토스트 실행 신대득
     * @param payload
     * @returns {Promise<void>}
     */
    const excuteToast = async function (payload){
      const players = await GetPlayerList(state.sessionId);
      console.log("toast 시작할 때 players : ", players);
      let presenterNickname="";
      for (let i = 0; i < players.content.length; i++) {
        if(players.content[i].connectionId==payload){
          presenterNickname=players.content[i].player.nickname;
        }
      }
      console.log("발표자 닉네임은?? : ", presenterNickname);

      let removeToast;
      const toast = document.getElementById("toast");
      toast.classList.contains("reveal") ?
      (clearTimeout(removeToast), removeToast = setTimeout(function () {
        document.getElementById("toast").classList.remove("reveal")
      }, 2000)) :
      removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
            }, 2000)
    toast.classList.add("reveal"),
        toast.innerText = "설명자 : "+ presenterNickname;
    };
    watch(inGame, (newValue) => { // 게임 시작했을 때, ready 버튼 모양 다시 초기화 
      if (newValue == true) {
        state.ready = false
      }
    })
    watch(readyAll, (newValue) => {  
      if (newValue == true) {
        state.startTimer = true
        setTimeout(() => {
          state.startTimer = false
          store.commit("gameStore/setInGame", true)
        }, 5000);
      }
    })
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
      clickReady,
      clickTeam,
      gameStart,
      joinSession,
      leaveSession,
      updateMainVideoStreamManager,
      gameTimer,
      forceRender,
      endRound,
      word,
      inGame
    };
  },
};
</script>

<style lang="scss" scoped>
/* ======= component-waiting ================================================================= */
.background-ingame {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(85, 140, 164, 1) 50%,
    rgba(0, 0, 0, 1) 100%
  );
}
.component-waiting {
  width: 800px;
  height: 550px;
  background: white;
  border-radius: 60px;
  padding: 40px;
}
.users-component {
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background: #d9d9d9;
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
  background: #f9f9f9;
  border-radius: 30px;
  border: 1px solid #e6e6e6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
.box-btn > button {
  width: 170px;
  height: 70px;
  border-radius: 30px;
  margin: 7px 0;
  transition: 0.1s;
}
.box-btn > button:hover {
  /* box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.5); */
}
.box-btn > button:active {
  box-shadow: inset 2px 4px 3px rgb(72, 72, 72);
}
.btn-ready {
  background: #24cb83;
  color: white;
  font-size: 25px;
  box-shadow : 1px 3px 3px rgb(72, 72, 72);
}
.btn-ready:hover {
  background: #24cb83;
  font-size: 30px;
}
.btn-ready:active {
  background: #80a000;;
}
.btn-ready.active {
  background: #98be00;;
  box-shadow : inset 0 3px 3px 0px #484848c2;

}
.btn-profile {
  background: #c6c6c6;
  color: white;
  font-size: 20px;
  box-shadow : 1px 3px 3px rgb(72, 72, 72);
}
.btn-profile:hover {
  background: #b7b7b7;
}
.btn-profile:active {
  background: rgb(172, 172, 172);
}

#title {
  width: 100%;
  height: 20px;
  text-align: left;
  margin: 7px 20px;
  font-weight: 600;
  font-size: 15px;
  color: #8b8b8b;
}

/* ----------------------------------- */

/* ======= component-ingame ================================================================= */
.gamescore {
  width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  margin: 30px;
}
.gameround {
  font-size: 20px;
  position: absolute;
  width: 100px;
  right: 0;
  top: 0;
  margin: 30px;
  color: white;
}
#word {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: rgb(81 255 255 / 67%);
  font-size: 25px;
  padding: 5px;
  font-weight: 600;
}
.component-ingame {
  width: 100%;
  max-width: 1000px;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
header {
  width: 100%;
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
}
#timer {
  font-size: 35px;
  color: white;
  font-family: "Orbitron", sans-serif;
}
.area-opponents {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  max-height: 100vh;
  min-width: 390px;
  overflow: hidden;
}
.area-ourteam {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-height: 100vh;
}
.me {
  position: relative;
}
.wrap-robot {
  position: absolute;
  top: 45px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120%;
  width: 100%;
  min-width: 300px;
  z-index: 0;
}
#robot {
  width: 300px;
  animation:hover 1.1s ease-in-out 0s infinite alternate;
}
$hover_top: 30px;
$hover_bottom: 50px;  

@keyframes hover { 
    0% { transform: translate3d(0,$hover_top,0) }
    100% { transform: translate3d(0,$hover_bottom,0) }
}
.sec-display {
  width: 100%;
}
.sec-display > .stream-me {
  width: 100%;
  overflow: hidden;
}
.sec-draw {
  position: relative;
}
.stream-opponent {
  transition-duration: 0.3s;
  height: 140.63px;
  margin: 10px 0;
  width: 250px;
  border-radius: 30px;
  opacity: 0.5;
  border: 1px solid rgba(81, 255, 255, 0.5);
}
.stream-opponent.presenter {
  height: 196.8px;
  margin: 10px 0;
  width: 350px;
  opacity: 0.9;
  box-shadow: 0 0 10px 3px rgba(81, 255, 255, 0.5);
}
.sec-draw .stream-me {
  /* 그림 그릴 때 내 모습 */
  height: 80px;
  width: auto;
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 12px;
  box-shadow: 0px 0px 20px 0px #0000005c;
  opacity: 0.8;
  z-index: 1;
}
.sec-display .stream-me {
  /* 그림 그릴 때 내 모습 */
  height: 300px;
  width: auto;
  border-radius: 30px;
  box-shadow: 0 0 50px 1px rgb(81 255 255 / 50%);
}
.canvas {
  width: 100%;
  z-index: 1;
}
#toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    padding: 15px 20px;
    transform: translate(-50%, 10px);
    border-radius: 30px;
    overflow: hidden;
    font-size: .8rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity .5s, visibility .5s, transform .5s;
    background: rgba(0, 0, 0, .35);
    color: #fff;
    z-index: 10000;
}

#toast.reveal {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0)
}
/* =========================================================================================== */
</style>