<template>
  <div class="roomlist">
    <div class="inner-roomlist">
      <v-img src="@/assets/images/earth.png" id="earth" alt="earth" />
      <div class="wrap-btn">
        <button
          @click="state.isTeamBattle = false"
          :class="state.isTeamBattle ? '' : 'active'"
        >
          개인전
        </button>
        <button
          @click="state.isTeamBattle = true"
          :class="state.isTeamBattle ? 'active' : ''"
        >
          팀전
        </button>
      </div>
      <div class="wrap-list">
        <RoomListItem
          v-for="room in state.roomlist"
          :key="room.id"
          :room="room"
          @click="getInRoom(room)"
          class="list-item"
        />
        <div
          class="list-item blank"
          v-for="blank in 5 - state.roomlist.length"
          :key="blank"
        ></div>
        <div v-if="state.passwordDialog">

          <password-input 
          
          v-for="room in state.roomlist"
          :key="room.id"
          :room="room"/>
        </div>
        <div class="btn-paging">
          <button>PREV</button>
          <button>NEXT</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { getCurrentInstance } from "vue";
import { reactive, onMounted, computed } from "vue";
import { roomList } from "@/common/api/gameAPI";
import RoomListItem from "@/views/MainPage/Components/RoomListItem.vue";
import PasswordInput from "@/views/WaitingPage/components/PasswordInput.vue";

export default {
  name: "RoomList",
  components: {
    RoomListItem,
    PasswordInput
  },
  // emits: ["sendValue"],
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      isTeamBattle: false,
      password: null,
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
    });

    const getInRoom = function (params) {
      const roominfo = JSON.parse(JSON.stringify(params));
      if (roominfo.isSecret) {
        state.passwordDialog = true
        
      } else {
      // state.password = prompt('비밀번호를 입력해주세요.');
      console.log(state.password)
      console.log(roominfo.isTeamBattle)
      store.commit("gameStore/setTitle", roominfo.title);
      store.commit("gameStore/setTeam", roominfo.isTeamBattle);
      store.commit("gameStore/setSecret", roominfo.isSecret);
      store.commit("gameStore/setPassword", roominfo.password);
      router.push({
        name: "gameroom",
        params: { sessionId: roominfo.sessionId },
      });
    }
    };

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
</style>