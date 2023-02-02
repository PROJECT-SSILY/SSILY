<template>
  <div>
    <h3>RoomList</h3>
    <v-card class="mx-auto" max-width="500">
      <v-toolbar color="deep-purple accent-4" dark>
        <v-row>
          <v-col class="title">
            <h3>방 제목</h3>
          </v-col>
          <v-col>
            <v-switch
              v-model="state.switch1"
              :label="`모드: ${state.switch1 ? '개인':'팀'}`"
              @click="isTeamGame"
              color="orange darken-3"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-list subheader>
        <v-list-item
          v-for="room in state.roomlist"
          :key="room.id"
          @click="getInRoom(room)"
        >
        <RoomListItem :room="room"/>
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
export default {
  name: "RoomList",
  components: {
    RoomListItem
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      privaterooms: [],
      teamrooms: [],
      roomlist: [],
      switch1: true,
    })

    const getInRoom = function (params) {
      const roominfo = JSON.parse(JSON.stringify(params));
      console.log('roominfo : ', roominfo)
      store.commit('gameStore/setMySessionId', roominfo.sessionId)
      console.log(roominfo.sessionId)
      store.commit('gameStore/setTitle', roominfo.title)
      store.commit('gameStore/setTeam', roominfo.isTeamBattle)
      // console.log('team')
      router.push({name: 'waiting'})
    }

    const isTeamGame = async function() {
      console.log(state.switch1);
      if (state.switch1) {
        state.roomlist = state.privaterooms
      } else {
        state.roomlist = state.teamrooms
      }
    }

    // 방 리스트 조회
    onMounted(async () => {
      const res = await roomList()
      const response = res.data
      console.log(response)
      for (let i=0; i<response.content.length; i++) {
        if (response.content[i].isTeamBattle) {
          state.teamrooms.push(response.content[i])
        } else {
          state.privaterooms.push(response.content[i])
        }
      }
      // response.data
    })
    return {
      state,
      getInRoom,
      isTeamGame,
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
}

</style>