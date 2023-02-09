<template>
  <div class="wrap_component">
    <!----------------------------------- 개발용 버튼 -------------------------------------->
    <p>
      <v-btn @click="clickTest">게임 시작 테스트</v-btn> |
      <v-btn @click="state.isTeamBattle = !state.isTeamBattle"
        >팀/개인전 변경</v-btn
      >
      |
      <v-btn>게임 순서 변경</v-btn>
    </p>
    <!------------------------------------------------------------------------------------->
    <div class="waiting_component" v-if="!readyAll">
      <div class="users_component">
        <WaitingPage
          :sessionId="state.sessionId"
          :playerList="state.playerList"
          :session="state.session"
          :myConnectionId="state.connectionId"
          :team="state.team"
        />
      </div>

      <div class="side_component flex-item">
        <v-radio-group
          class="select_team"
          inline
          v-model="state.team"
          justify-content="center"
        >
          <v-radio
            label="RED"
            value="RED"
            color="red"
            class="ma-2"
            @click="clickTeam(RED)"
          ></v-radio>
          <v-radio
            label="BLUE"
            value="BLUE"
            color="indigo"
            class="ma-2"
            @click="clickTeam(BLUE)"
          ></v-radio>
        </v-radio-group>
        <div class="chat_box">
          <ChattingBox />
        </div>
        <div class="side_footer">
          <div class="sidebtn">
            <v-btn class="readybtn" v-if="!state.ready" @Click="clickReady"
              >READY</v-btn
            >
            <v-btn class="readybtn" v-if="state.ready" @Click="clickReady"
              >CANCEL READY</v-btn
            >
          </div>

          <div class="sidebtn">
            <v-btn class="exitbtn" @click="clickExit">EXIT</v-btn>
          </div>
        </div>
        <div class="sidebtn">
          <v-btn class="exitbtn" @click="gameStart()">Game Start</v-btn>
        </div>
      </div>
    </div>
    <div class="in_game_component" v-else>
      <GameTimer date="August 15, 2016" />
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
  </div>
</template>
<script>
import GameTimer from "./components/GameTimer.vue";
import UserVideo from "./components/UserVideo.vue";
import MyCanvasBox from "./components/MyCanvasBox.vue";
import WaitingPage from "@/views/WaitingPage/WaitingPage.vue";
import ChattingBox from "@/views/WaitingPage/components/ChattingBox.vue";
import $axios from "axios";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { GetPlayerList } from "@/common/api/gameAPI";
import { reactive } from "@vue/reactivity";
import { onBeforeMount, computed } from "vue";

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
      nickname: computed(() => store.state.accountStore.nickname),

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

    onBeforeMount(async () => {
      await store.dispatch("accountStore/getMeAction");
      console.log("join start");
      joinSession();
    });

    const joinSession = async function () {
      const players = await GetPlayerList(state.sessionId);
      console.log("players : ", players);
      // const content = players.content
      // for (let i=0; i<content.length; i++) {
      //     if(content.length > 0 && content.player == state.nickname) {
      //         alert("잘못된 접근입니다.")
      //         router.push({name : 'main'})
      //         return
      //     }
      // }
      store.commit("gameStore/setSessionId", state.sessionId); // 실행 전 세션id 저장 | 이은혁
      await store.dispatch("gameStore/joinSession", state.sessionId);
    };
    const leaveSession = async function () {
      store.dispatch("gameStore/leaveSession");
      window.removeEventListener("beforeunload", leaveSession);
    };

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

    return {
      router,
      state,
      readyAll,
      publisher,
      myTeams,
      opponents,
      amIDescriber,
      userList,
      clickExit,
      clickTest,
      clickReady,
      clickTeam,
      gameStart,
      joinSession,
      leaveSession,
      updateMainVideoStreamManager,
    };
  },
};
</script>

<style scoped>
.wrap_component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.waiting_component {
  display: flex;
  flex-direction: row;
  padding: 20px;
  max-width: 1200px;
  min-width: 800px;
  width: 100%;
  justify-content: space-between;
}
.side_component {
  width: 300px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.select_team {
  display: flex;
  border-radius: 30px;
  background-color: #ffffffeb;
  justify-content: center;
  margin-bottom: 10px;
}
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

.sidebtn {
  display: inline-block;
  width: 50%;
  padding-top: 10px;
}
.sidebtn:first-child {
  padding-right: 5px;
}
.sidebtn:last-child {
  padding-left: 5px;
}
.sidebtn > button {
  width: 100%;
  margin: 0px;
  border-radius: 20px;
  height: 70px;
  box-sizing: border-box;
  font-family: sans-serif;
  font-weight: 900;
  font-size: 25px;
  border: 7px solid #ffffffeb;
}
.readybtn {
  background: linear-gradient(
    342deg,
    rgba(198, 255, 0, 1) 0%,
    rgba(108, 204, 55, 1) 100%
  );
}
.exitbtn {
  background: rgb(224, 61, 61);
  background: linear-gradient(
    133deg,
    rgba(224, 61, 61, 1) 0%,
    rgba(255, 93, 93, 1) 100%
  );
}
</style>
