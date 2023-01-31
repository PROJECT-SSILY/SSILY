<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <h1>메인 화면</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <room-list></room-list>
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
              <v-col v-if="teamvalue">
                <v-btn color="success"
                >
                팀 게임 시작</v-btn>
              </v-col>
              <v-col v-else>
                <v-btn color="primary"
                @click="cons"
                >
                {{ teamvalue }}
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
import { reactive } from "vue"
import { computed } from "vue"
// import { mapGetters } from 'vuex'

export default {
  name: 'MainPage',
  setup() {
    const store = useStore()
    const state = reactive({
      teamorprivate: null
    })
    // const teamvalue = computed(() => store.state.gameStore.teamorprivate)
    const teamvalue = computed(() => store.state.teamorprivate)
    const cons = function() {
      console.log(teamvalue)
    }
    return {
      store, 
      state,
      cons,
      teamvalue
      }
    },
    // computed: {
    //   ...mapGetters([
    //     'getTeam'
    //   ]),
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