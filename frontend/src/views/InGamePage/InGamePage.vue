<template>
  <div class="wrap-page">
    <MyPageDialog v-show="state.myPageDialog"/>
    <div class="text-center">
      <v-snackbar
        v-model="state.snackbar"
        label="Top"
        value="top"
        :timeout="2000"
        location="top"
        color="#716add"
        rounded="pill"
      >
        <p style="font-size: 15px;">&#127908; {{ state.text }}</p>
        <template v-slot:actions>
        </template>
      </v-snackbar>
    </div>
    <FooterBoxVue v-if="!inGame" />
    <!----------------------------------- 개발용 버튼 -------------------------------------->
    <!-- <p style="position: absolute; top: 0; opacity: 0.2; z-index: 3">
      <v-btn @click="clickTest">게임 시작 테스트</v-btn> |
      <v-btn @click="state.isTeamBattle = !state.isTeamBattle"
        >팀/개인전 변경</v-btn
      >
      <v-btn>게임 순서 변경</v-btn>
      <v-btn @click="forceRender">시계</v-btn>
    </p> -->
    <!------------------------------------------------------------------------------------->

    <!-- 아래부터 대기방 페이지 관련 코드-->
    <div class="wrap-timer">
      <div class="start-timer" v-if="state.startTimer">
        <StartTimer />
      </div>
    </div>
    <div class="component-waiting" v-if="!inGame">
      <div class="users-component">
        <p id="title">{{ state.title }}</p>
        <WaitingPage
          :sessionId="state.sessionId"
          :playerList="state.playerList"
          :session="state.session"
          :myConnectionId="state.connectionId"
          :team="state.team"
        />
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
            v-if="!readyAll"
          >
            READY
          </button>
          <button
            class="btn-ready"
            disabled
            :class="state.ready ? 'active' : ''"
            v-if="readyAll"
          >
            READY
          </button>
          <button class="btn-profile" @click="state.myPageDialog=!state.myPageDialog">내 프로필</button>
          <div
          class="bg-dark"
          :class="state.myPageDialog ? 'active':''"
          @click="closeDialog"
        ></div>
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
      <p class="gameround">{{ state.showRound }} ROUND</p>
      <!-- <RoundResult /> -->
      <GameScore class="gamescore" />
      <GameResult v-show="endGame" class="result-dialog"/>
      <div id="word" v-if="amIDescriber">
        <p>제시어</p>
        <p>{{ word }}</p>
      </div>

      <!-- 상대 팀 -->
      <div class="area-opponents">
        <user-video
          class="stream-opponent"
          v-for="sub in opponents"
          :key="sub.stream.connection.connectionId"
          :userId="sub.stream.connection.connectionId"
          :stream-manager="sub"
          :class="
            sub.stream.connection.connectionId === currentPresenterId
              ? 'presenter'
              : ''
          "
        />
      </div>
      <!-- 우리 팀 -->
      <div class="area-ourteam">
        <div class="me">
          <div class="sec-draw" v-if="!amIDescriber">
            <MyCanvasBox class="canvas" />
            <user-video :stream-manager="publisher" class="stream-me" />
          </div>
          <div class="sec-display" v-else>
            <user-video :stream-manager="publisher" class="stream-me" />
          </div>
          <div class="wrap-robot" v-if="!amIDescriber">
            <v-img
              id="robot"
              :src="require(`@/assets/images/${state.robot}.svg`)"
              alt="robot"
            />
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
      <footer>
        <button @click="skipWord" id="skip" v-if="amIDescriber">skip</button>
      </footer>

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
import StartTimer from "@/views/InGamePage/components/StartTimer.vue";
import FooterBoxVue from "../MainPage/Components/FooterBox.vue";
// import RoundResult from "./components/RoundResult.vue";
import GameResult from "../InGamePage/components/GameResult.vue";
import Swal from "sweetalert2";
import MyPageDialog from "./components/MyPageDialog.vue";
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
    StartTimer,
    FooterBoxVue,
    MyPageDialog,
    // RoundResult,
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
    const word = computed(() => store.state.gameStore.word);
    const round = computed(() => store.state.gameStore.round);
    const endGame = computed(() => store.state.gameStore.endGame);
    const endRound = computed(() => store.state.gameStore.endRound);
    const inGame = computed(() => store.state.gameStore.inGame);
    const sortedUserList = computed(() => store.state.gameStore.sortedUserList);
    const winnerNickname = computed(() => store.state.gameStore.winnerNickname);
    //const winnerList = computed(() => store.state.gameStore.winnerList);
    const isTimeOut = computed(() => store.state.gameStore.isTimeOut);
    //const gameResult = computed(() => store.state.gameStore.gameResult);
    const imageURL = computed(() => store.state.gameStore.imageURL);
    const currentPresenterId = computed(() => {
      /**
       * 토스트 실행
       * 신대득
       */
      if (round.value==1 && store.state.gameStore.presenterId != "") {
        excuteToast(store.state.gameStore.presenterId);
      }
      return store.state.gameStore.presenterId;
    });
    const router = useRouter();
    const state = reactive({
      title: computed(() => store.state.gameStore.title),
      isSecret: false,
      password: null,
      isTeamBattle: null,
      mainStreamManager: undefined,
      sessionId: route.params.sessionId || null,
      isHost: true,
      showRound:1,
      connectionId: null,
      nickname: computed(() => store.state.accountStore.user.nickname),
      level: computed(() => store.state.accountStore.user.level),
      robot: computed(() => {
        if (state.level >= 0 && state.level < 6) {
          return "ssily1";
        } else if (state.level >= 6 && state.level < 11) {
          return "ssily2";
        } else {
          return "ssily3";
        }
      }),
      startTimer: false,

      // 팀 분류
      myTeam: null,
      opponentTeam: [],

      // 게임 순서 관련
      ready: false,
      team: null,
      // 스낵바 관련
      snackbar: false,
      text: '대화 시작! 마이크가 활성화되었습니다.',
      timeout: 2000,
      myPageDialog: false
    });
    const closeDialog = () => {
      state.myPageDialog = false;
    };


    // == OpenVidu State ==
    const publisher = computed(() => store.state.gameStore.publisher);
    const myTeams = computed(() => store.getters["gameStore/getMyTeams"]);
    const opponents = computed(() => store.getters["gameStore/getOpponents"]);
    const joinSession = async function () {
      const players = await GetPlayerList(state.sessionId);
      console.log("players : ", players);
      for (let i = 0; i < players.content.length; i++) {
        console.log(
          "접근 가능 여부 확인중.. ",
          players.content[i].player.nickname,
          state.nickname
        );
        if (players.content[i].player.nickname === state.nickname) {
          alert("잘못된 접근입니다.");
          router.push({ name: "main" });
          return;
        }
      }
      store.commit("gameStore/setSessionId", state.sessionId); // 실행 전 세션id 저장 | 이은혁
      console.log("여기까지");
      await store.dispatch("gameStore/joinSession", state.sessionId);
      console.log("여기까지 완료");
    };
    const leaveSession = async function () {
      store.dispatch("gameStore/leaveSession");
      window.removeEventListener("beforeunload", leaveSession);
    };
    // onMounted(() => {
    //   store.commit("gameStore/setInGame", false)
    // })

    onBeforeMount(async () => {
      store.commit("gameStore/setInGame", false);
      await store.dispatch("accountStore/getMeAction");
      joinSession();
    });

    const updateMainVideoStreamManager = async function (stream) {
      store.dispatch("gameStore/updateMainVideoStreamManager", stream);
    };

    const clickReady = () => {
      console.log("ready");
      state.ready = !state.ready;
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

    const skipWord=async function(){
      console.log("skipWord 실행!!!");
      store.dispatch('gameStore/skipRound');
    };

    /**
     * 토스트 실행 신대득
     * @param payload
     * @returns {Promise<void>}
     */
    const excuteToast = async function (payload) {
      const players = await GetPlayerList(state.sessionId);
      console.log("toast 시작할 때 players : ", players);
      let presenterNickname = "";
      for (let i = 0; i < players.content.length; i++) {
        if (players.content[i].connectionId == payload) {
          presenterNickname = players.content[i].player.nickname;
        }
      }
      console.log("발표자 닉네임은?? : ", presenterNickname);

      let removeToast;
      const toast = document.getElementById("toast");
      toast.classList.contains("reveal")
        ? (clearTimeout(removeToast),
          (removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal");
          }, 2000)))
        : (removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal");
          }, 2000));
      toast.classList.add("reveal"),
        (toast.innerText = "설명자 : " + presenterNickname);
    };
    watch(inGame, (newValue) => {
      // 게임 시작했을 때, ready 버튼 모양 다시 초기화
      if (newValue == true) {
        state.ready = false;
      } else {
        state.showRound = 1
      }
    });
    watch(readyAll, (newValue) => {
      if (newValue == true) {
        state.startTimer = true;
        setTimeout(() => {
          state.startTimer = false;
          store.commit("gameStore/setInGame", true);
        }, 3000);
      }
    });

    //윤미작업
    let timerInterval;
    watch(endRound, (newValue) => {
      if (newValue) {
        state.snackbar=true
        if (!isTimeOut.value && !endGame.value) {
          Swal.fire({
            title: round.value - 1 + "round 결과",
            color: "#716add",
            backdrop: `
              rgba(0,0,123,0.4)
              left top
              no-repeat
            `,
            html:
              `<div>${winnerNickname.value} WIN!!</div>` +
              `<div>정답 : ${word.value}</div>` +
              '<canvas class="canvas" width="650" height="400" id="aCanvas"></canvas>' +
              sortedUserList.value
                .map((user) => `<div>${user.nickname} : ${user.score}점</div>`)
                .join(""),
            timer: 5000,
            width: 750,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: async () => {
              Swal.showLoading();
              //const getFile = await store.dispatch("gameStore/downloadImage");
              const getFile = imageURL.value;
              const myCanvas = Swal.getHtmlContainer().querySelector("canvas");
              var ctx = myCanvas.getContext("2d");
              var img = new Image();
              img.src = getFile;
              img.onload = function () {
                ctx.drawImage(img, 0, 0); // Or at whatever offset you like
                //ctx.scale(0.8, 0.8);
              };
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              store.dispatch("gameStore/changeRoundEnd", false);
              if(round.value<9) {
                excuteToast(currentPresenterId.value);
                state.showRound=round.value;
              }
            }
          });
        } else if (isTimeOut.value) {
          Swal.fire({
            title: round.value - 1 + "round 결과",
            color: "#716add",
            html:
              "<h1>정답자가 없습니다!!</h1>" +
              `<div>정답 : ${word.value}</div>`,
            timer: 5000,
            timerProgressBar: true,
            allowOutsideClick: false,
            width: 650,
            didOpen: async () => {``
              Swal.showLoading();
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              store.dispatch("gameStore/changeRoundEnd", false);
              if(round.value<9) {
                excuteToast(currentPresenterId.value);
                state.showRound=round.value;
              }
            }
          });
        }
      }
    });
    watch(state.myPageDialog, () => {
      console.log('정보??')
      store.dispatch("accountStore/getMeAction");
    }) // myPageDialog에 정보 업데이트 위해 추가

    // watch(endGame, (newValue) => {
    //   if (newValue) {
    //     state.snackbar=true
    //     Swal.fire({
    //       title: "게임 결과",
    //       padding: "3em",
    //       color: "#716add",
    //       backdrop: `
    //           rgba(0,0,123,0.4)
    //           left top
    //           no-repeat
    //         `,
    //       html:
    //         "<div>" +
    //         winnerList.value
    //           .map((winner) => `<h1>${winner} WIN!!</h1>`)
    //           .join('') +
    //         "</div>" +
    //         "<div>" +
    //         Object.entries(gameResult.value).map(([key, value]) =>
    //           rankContent(key, value)
    //         ).join('')+
    //         "</div>",
    //       allowOutsideClick: false,
    //       confirmButtonText: "돌아가기",
    //       confirmButtonColor: "#3085d6",
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         store.commit("gameStore/setEndGame", false);
    //         store.commit("gameStore/setInGame", false);
    //         store.commit("gameStore/setIsAllReady", false);
    //         store.commit("gameStore/setAudioStatus", false);
    //       }
    //       (rankIndex = 0), (rankValue = null);
    //     });
    //   }
    // });

    /*
    let rankIndex = 0;
    let rankValue = null;
    const rankContent = (key, value) => {
      if (rankValue == value.extraExp) {
        //공동 n등
        return `<h1> ${parseInt(rankIndex) + 1}등 ${value.nickname} + ${
          value.extraExp
        } Exp </h1>`;
      } else {
        rankIndex = key;
        rankValue = value.extraExp;
      }
      return `<h1> ${parseInt(rankIndex) + 1}등 ${value.nickname} + ${
        value.extraExp
      } Exp</h1>`;
    };
    */

    // ========음소거 풀기 ======================


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
      inGame,
      closeDialog,
      skipWord,
    };
  },
};
</script>

<style lang="scss" scoped>
.result-dialog {
  font-family: 'KOFIHDrLEEJWTTF-B';
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}
/* -----------개발용------------*/

#skip {
  width: 500px;
  height: 300px;
  margin: 20px;
  color: transparent;
}
#skip:hover {
  color: white;
}
/* -----------개발용------------*/







/* ======= component-waiting ================================================================= */
.wrap-timer {
  position: fixed;
  width: 400px;
  z-index: 5;
}
.start-timer {
  margin-top: 15px;
  height: 225px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 500px;
}
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
  box-shadow: 1px 3px 3px rgb(72, 72, 72);
}
.btn-ready:hover {
  background: #24cb83;
  font-size: 30px;
}
.btn-ready:active {
  background: #80a000;
}
.btn-ready.active {
  background: #98be00;
  box-shadow: inset 0 3px 3px 0px #484848c2;
}
.btn-profile {
  background: #c6c6c6;
  color: white;
  font-size: 20px;
  box-shadow: 1px 3px 3px rgb(72, 72, 72);
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
  font-size: 30px;
  color: rgb(67 193 193);
  font-family: "Orbitron", sans-serif;
  position: absolute;
  width: 200px;
  right: 0;
  top: 0;
  margin: 30px;
}
#word {
  position: absolute;
  top: 7rem;
  color: rgb(81 255 255 / 67%);
}
#word p:first-child {
  font-size: 20px;
}
#word p:last-child {
  font-size: 33px;
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
  width: 30%;
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
  width: 70%;
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
  left: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 120%;
  width: 100%;
  min-width: 300px;
  z-index: 0;
}
// 수정 전: left 0
#robot {
  width: 300px;
  animation: hover 1.1s ease-in-out 0s infinite alternate;
}
$hover_top: 30px;
$hover_bottom: 50px;

@keyframes hover {
  0% {
    transform: translate3d(0, $hover_top, 0);
  }
  100% {
    transform: translate3d(0, $hover_bottom, 0);
  }
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
  transition: 0.2s;
  position: relative;
}
@keyframes blink-effect {
  50% {
    box-shadow: none;
  }
}
.stream-opponent.presenter {
  height: 196.8px;
  margin: 10px 0;
  width: 350px;
  opacity: 1;
  box-shadow: 0 0 20px 5px rgb(81 255 255 / 70%);
  box-sizing: content-box;
  animation: blink-effect 2s ease-in-out infinite;
}
// 수정 전 : box-shadow: 0 0 10px 5px gba(81, 255, 255, 0.5);
// border 없었음   width: 350px;
.sec-draw .stream-me {
  /* 그림 그릴 때 내 모습 */
  height: 110px;
  width: auto;
  position: absolute;
  left: 10px;
  bottom: 10px;
  border-radius: 12px;
  box-shadow: 0px 0px 20px 0px #0000005c;
  opacity: 0.8;
  z-index: 1;
}
// 수정 전 - height: 80
.sec-display .stream-me {
  /* 그림 그릴 때 내 모습 */
  height: 300px;
  width: 533px;
  border-radius: 30px;
  border: 1px solid rgba(81, 255, 255, 0.5);
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
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s, visibility 0.5s, transform 0.5s;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  z-index: 10000;
}

#toast.reveal {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}
/* =========================================================================================== */

.wrap-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
