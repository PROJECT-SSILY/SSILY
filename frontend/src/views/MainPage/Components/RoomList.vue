<template>
    <div>
      <!-- <rotate-square2 v-if="state.isLoading"></rotate-square2> -->
      <v-card
        max-width="500"
      >
        <v-toolbar
        :color="state.switch1 ? 'red lighten-1' : 'amber darken-2'"
          dark
        >
          <v-row>
            <v-col class="title">
              <h3>방 제목</h3>
            </v-col>
            <v-col>
                <v-switch class="title"
                v-model="state.switch1"
                :label="`모드: ${state.switch1 ? '개인':'팀'}`"
                @click="isTeamGame(), sendValue()"
                color="orange darken-3"
                hide-details
                ></v-switch>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-list subheader v-if="state.switch1">
          <v-list-item
            v-for="room in state.privaterooms"
            :key="room.id"
            @click="getInRoom(room)"
          >
            <v-row class="d-flex justify-space-between">
              <v-col cols="10"> 
                <v-list-item-content>
                  <RoomListItem :room="room"/>
                </v-list-item-content>
              </v-col>
            </v-row>
            <!-- <v-divider></v-divider> -->
          </v-list-item>
        </v-list>
        <v-list subheader v-else>
          <v-list-item
            v-for="room in state.teamrooms"
            :key="room.title"
            @click="getInRoom(room)"
          >
          <v-row class="d-flex justify-space-between">
            <v-col cols="10">
              <v-list-item-content>
                <RoomListItem :room="room"/>
              </v-list-item-content>
            </v-col>
          </v-row>
          <!-- <v-divider></v-divider> -->
          </v-list-item>
        </v-list>
      </v-card>      
    </div>
  </template>
  
<script>
import { reactive, onMounted } from "vue"
import { roomList } from "@/common/api/gameAPI";
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import RoomListItem from '@/views/MainPage/Components/RoomListItem.vue'
import { getCurrentInstance } from "vue";
// import {RotateSquare2} from 'vue-loading-spinner'

export default {
  name: "RoomList",
  components: {
    RoomListItem,
    // RotateSquare2
  },
  emits: ["sendValue"],
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      privaterooms: [],
      teamrooms: [],
      roomlist: [],
      switch1: true,
      // isLoading: false
    })

    const getInRoom = function (params) {
      const roominfo = JSON.parse(JSON.stringify(params));
      store.commit('gameStore/setTitle', roominfo.title)
      store.commit('gameStore/setTeam', roominfo.isTeamBattle)
      router.push({name: 'gameroom', params: { sessionId: roominfo.sessionId }})
    }

    const isTeamGame = async function() {
      console.log(state.switch1);
      if (state.switch1) {
        state.roomlist = state.privaterooms
      } else {
        state.roomlist = state.teamrooms
      }
    }
    const { emit } = getCurrentInstance();
    const sendValue = function() {
      emit('sendValue', state.switch1)
      console.log(state.switch1);
    }

    // 방 리스트 조회
    onMounted(async () => {
      // state.isLoading = true
      const res = await roomList()
      const response = res.data
      console.log(response)
      for (let i=0; i<response.content.length; i++) {
        if (response.content[i].isTeamBattle) {
          if (response.content[i].isPlaying == false && response.content[i].connections.numberOfElements < 4) {
          state.teamrooms.push(response.content[i])
          }
        } else {
          if (response.content[i].isPlaying == false && response.content[i].connections.numberOfElements < 4) {
          state.privaterooms.push(response.content[i])
          }
        }
      }
      // state.isLoading = false
    })

    return {
      state,
      getInRoom,
      isTeamGame,
      sendValue
    }
  }
}
</script>

<style scoped>

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}

</style>