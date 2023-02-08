<template>
  <!-- <v-list-item-title v-text="room.title"></v-list-item-title> -->
  <v-row class="d-flex justify-space-between">
    <v-col cols="1">
      <v-list-item-content>
        <h3 class="title"></h3>
      </v-list-item-content>
    </v-col>
    <v-col cols="5">
      <v-list-item-content>
        <h3 class="title">{{ room.title }}</h3>
      </v-list-item-content>
    </v-col>
    <v-col>
      <v-list-item-icon>
        <v-icon v-if="room.isSecret"
        color="blue-grey darken-2">
        mdi-lock-outline
        </v-icon>
      </v-list-item-icon>
    </v-col>
    <v-col cols="2">
      <v-list-item-content>
        <v-btn color="red lighten-1">{{ room.connections.numberOfElements }} / 4</v-btn>
      </v-list-item-content>
    </v-col>
  </v-row>
</template>
<script>
import { useRouter } from "vue-router"
import { useStore } from "vuex"
export default {
    props: {
        room: Object
    },
    setup() {
      const router = useRouter()
      const store = useStore()
      const getInRoom = function (params) {
        const roominfo = JSON.parse(JSON.stringify(params))
        store.commit('gameStore/setTitle', roominfo.title)
        store.commit('gameStore/setTeam', roominfo.isTeamBattle)
        router.push({name: 'gameroom', params: { sessionId: roominfo.sessionId }})
      }
    return {
      router,
      store,
      getInRoom
    }
  }
}
</script>

<style>

</style>