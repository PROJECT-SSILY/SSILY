<template>
  <div class="roomlist" >
    <div class="inner-roomlist" >
      <v-img src="@/assets/images/earth.png" id="earth" alt="earth" />
      <div class="wrap-btn">
        <button
          @click="state.isTeamBattle = false"
          :class="state.isTeamBattle ? '' : 'active'"
        >
          개인전
        </button>
        <!-- <button
          @click="state.isTeamBattle = true"
          :class="state.isTeamBattle ? 'active' : ''"
        >
          팀전
        </button> -->
        <button
          @click="comingsoon('팀전')"
        >
          팀전
        </button>
      </div>
      <alert-dialog v-if="state.alert"/>
      <div class="wrap-list">
        <RoomListItem
          v-for="room in paginatedData"
          :key="room.createdAt"
          :room="room"
          @click="getInRoom(room)"
          class="list-item"
        />
        <div v-if="state.roomlist.length == 0">
          <div class="list-item blank"> 
            <p class="no-room">입장 가능한 방이 없습니다😥</p>
          </div>
          <div 
          class="list-item blank"
          v-for="blank in 4 - paginatedData.length"
          :key="blank"
          ></div>
        </div>
        <div v-else>
          <div 
          class="list-item blank"
          v-for="blank in 5 - paginatedData.length"
          :key="blank"
          ></div>
        </div>
        <div class="btn-paging">
          <button 
          @click="prevPage" 
          :disabled="prevButtonDisabled"
          >PREV</button>
          <button>
            <v-icon @click="refreshRoom">mdi-refresh</v-icon>
          </button>
          <button 
          @click="nextPage"
          :disabled="nextButtonDisabled" 
          >NEXT</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 비밀번호 모달 -->
  <div class="wrap-page" v-show="state.passwordDialog">
    <div class="wrap-dialog">
      <div class="dialog">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="submitPw"
        >
          <v-text-field 
            label="비밀번호 숫자 4자리를 입력하세요."
            hide-details="auto"
            v-model="state.input"
            type="password"
            maxlength="4"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p class="text-center">
              <button type="submit" class="btn-dialog">참가하기</button>
            </p>
          </v-card-actions>
        </v-form>
    </div>
      <div
        class="bg-dark"
        :class="state.passwordDialog ? 'active':''"
        @click="closeDialog"
      ></div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive, onMounted, computed } from "vue";
import { roomList, room } from "@/common/api/gameAPI";
import RoomListItem from "@/views/MainPage/Components/RoomListItem.vue";
import AlertDialog from '../../AlertDialog.vue'

export default {
  name: "RoomList",
  components: {
    RoomListItem,
    AlertDialog
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      room: {
        title: null,
        password: null,
        isTeamBattle: null,
        isSecret: false,
        sessionId: null,
      },
      input: null,
      isTeamBattle: false,
      teamrooms: [],
      privaterooms: [],
      roomlist: computed(() => {
        if (state.isTeamBattle) {
          return state.teamrooms;
        } else {
          return state.privaterooms;
        }
      }),
      passwordDialog: false,
      pageNum: 0
    });

    const getInRoom = async function (params) {
      const roominfo = JSON.parse(JSON.stringify(params));
      state.room.title = roominfo.title
      state.room.password = roominfo.password
      state.room.isTeamBattle = roominfo.isTeamBattle
      state.room.isSecret = roominfo.isSecret
      state.room.sessionId = roominfo.sessionId
      // console.log("roomInfo = ", roominfo.isPlaying);
  
      const response = await getRoom(roominfo.sessionId);

      console.log("response = ", response);

      if(response == 404) {
        // 존재하지 않는 방 입장 시
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '존재하지 않는 방입니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      } else if(response.isPlaying){
        // 이미 시작한 방
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '이미 게임이 시작한 방입니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      } else if(response.connections.numberOfElements >= 4){
        // 가득찬 방
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '가득찬 방입니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      } else if (roominfo.isSecret && !state.passwordDialog) { 
        // 비밀번호 입력이 필요한 방에 입장하는 경우
        state.passwordDialog = true
      } else { 
        // 입장이 가능한 경우
        store.commit("gameStore/setTitle", state.room.title);
        store.commit("gameStore/setTeam", state.room.isTeamBattle);
        store.commit("gameStore/setSecret", state.room.isSecret);
        store.commit("gameStore/setPassword", state.room.password);

        router.push({name: "gameroom", params: { sessionId: state.room.sessionId },});
      } 
    };
    const submitPw = () => {
      const pw = state.input
      if (pw===state.room.password) {
        store.commit("gameStore/setTitle", state.room.title);
        store.commit("gameStore/setTeam", state.room.isTeamBattle);
        store.commit("gameStore/setSecret", state.room.isSecret);
        store.commit("gameStore/setPassword", state.room.password);
        router.push({name: "gameroom", params: { sessionId: state.room.sessionId },});
      } else {
        state.alert = false
        store.commit('accountStore/setAlertColor', 'error')
        store.commit('accountStore/setAlertMessage', '비밀번호가 틀렸습니다.')
        store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      }
    }
    // 없는 방 조회시 오류 반환
    const getRoom = (sessionId) => {
      const response= room(sessionId);
      return response;
    }

    // 페이지네이션
    const pageList = computed(() => {
        let listLeng = state.roomlist.length;
        let listSize = 5;
        let page = Math.floor(listLeng / listSize);
        if (listLeng % listSize > 0) {
            page += 1
        }
        return page
        });
    const paginatedData = computed(() => {
        const start = state.pageNum * 5;
        const end = start + 5;
        return state.roomlist.slice(start, end);
        })
    const nextPage = function() {
        state.pageNum += 1
    }
    const prevPage = function() {
        state.pageNum -= 1
    }
    const nextButtonDisabled = computed(() => state.pageNum >= (Math.ceil(state.roomlist.length / 5) - 1) );
    
    const prevButtonDisabled = computed(() => state.pageNum < 1);

    // 모달창 닫기
    const closeDialog = () => {
      state.passwordDialog = false;
    };
    const comingsoon = (message) => {
      alert(`${message} 기능은 추후 공개될 예정입니다. \n조금만 기다려주세요!`)
    }
    // 방 목록 새로고침

    const refreshRoom = async function () {
      const response = await roomList();
      console.log(response);
      state.privaterooms = []
      for (let i = 0; i < response.content.length; i++) {
        if (
          !response.content[i].isPlaying &&
          response.content[i].connections.numberOfElements < 4
        ) {
          if (response.content[i].isTeamBattle) {
            state.teamrooms.push(response.content[i]);
          } else {
            state.privaterooms.push(response.content[i]);
          }
        }
      }
    }
    // 방 리스트 조회
    onMounted(async () => {
      // 팀 분류하기 - 이은혁
      const response = await roomList();
      console.log(response);
      for (let i = 0; i < response.content.length; i++) {
        if (
          !response.content[i].isPlaying &&
          response.content[i].connections.numberOfElements < 4
        ) {
          if (response.content[i].isTeamBattle) {
            state.teamrooms.push(response.content[i]);
          } else {
            state.privaterooms.push(response.content[i]);
          }
        }
      }
    });

    return {
      state,
      getInRoom,
      submitPw,
      pageList,
      paginatedData,
      nextPage,
      prevPage,
      nextButtonDisabled,
      prevButtonDisabled,
      closeDialog,
      comingsoon,
      refreshRoom
    };
  },
};
</script>
<style scoped>
.roomlist {
  background: white;
  border-radius: 60px;
  overflow: hidden;
  box-shadow: 0px 0px 50px #0000005c;
}
#earth {
  width: 125px;
  height: 125px;
  position: absolute;
  margin-right: 50%;
  right: -62.5px;
  top: -14px;
  z-index: 1;
  box-shadow: 0px 5px 30px 8px #187a9ba8;
  border-radius: 100px;
}
.wrap-btn {
  position: relative;
}
.wrap-btn > button {
  width: 50%;
  height: 60px;
  font-size: 23px;
  background: #d3d3d3;
  color: white;
  font-weight: 500;
  box-shadow: inset 0px -4px 10px #0000003d;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.567);
}
.wrap-btn > button.active {
  background: none;
  color: black;
  box-shadow: none;
}
.wrap-list {
  height: 390px;
  padding: 25px 55px;
}
.list-item {
  width: 100%;
  height: 50px;
  margin: 10px 0;
  border-radius: 10px;
  background: #f5f5f5;
  box-shadow: 2px 4px 5px 0px #00000024;
  transition: 0.1s;
  cursor: pointer;
}
.list-item.blank {
  background: none;
  cursor: auto;
  box-shadow: none;
  border: 1px solid #e6e6e6;
}
.list-item:hover {
  background: #24CB83;
  color: white;
}
.list-item.blank:hover {
  background: none;
  color: black
}
.list-item.blank:active {
  background: none;
}
.list-item:active {
  background: #1fae70;
  color: white;
}
.btn-paging {
  padding: 11px 0;
}
.btn-paging>button {
  font-size: 15px;
  margin: 0 10px;
}
.wrap-page {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bg-dark {
  transition: .2s;
}
.bg-dark.active {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.wrap-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#tit-room {
  font-size: 15px;
  line-height: initial;
  font-weight: 600;
}

.no-room {
  padding: 11px; 
  line-height:initial
}
</style>