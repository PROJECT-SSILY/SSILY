<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <h1>메인 화면</h1>
            <v-btn @click="getMe">
              getme
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <room-list @sendValue="changeValue"></room-list>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <profile-box></profile-box>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <make-room-dialog></make-room-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="state.isTeam">
                <v-btn color="success"
                @click="randomTeam"
                >
                팀 게임 시작</v-btn>
              </v-col>
              <v-col v-else>
                <v-btn color="primary"
                @click="randomPrivate"
                >
                개인 게임 시작</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <tutorial-dialog></tutorial-dialog>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script>

import MakeRoomDialog from './Components/MakeRoomDialog.vue';
import TutorialDialog from './Components/TutorialDialog.vue';
import ProfileBox from './Components/ProfileBox.vue';
import RoomList from './Components/RoomList.vue';
import { useStore } from "vuex"
// import store from '@/store/gameStore';
import { reactive } from "vue"
// import { mapGetters } from 'vuex'

export default {
  name: 'MainPage',
  setup() {
    const store = useStore()
    const state = reactive({
      isTeam : null
    })
    function getMe () {
      console.log(store.getters['accountStore/getUser'])
    }
    const changeValue = function (value) {
      state.isTeam = value
      console.log(value)
    }

    const randomTeam = function () {
      console.log(state.isTeam)
    }
    const randomPrivate = function () {
      console.log(state.isTeam)
    }
    return {
      store, 
      state,
      getMe,
      changeValue,
      randomTeam,
      randomPrivate,
      }
    },
  components: {
    MakeRoomDialog,
    TutorialDialog,
    ProfileBox,
    RoomList,
    
  },
}
// }
</script>

<style scoped>

</style>