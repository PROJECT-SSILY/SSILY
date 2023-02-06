<template>
    <div>
      <v-container>
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
                <v-img class="start-planet" @click="randomTeam" src="../../../public/planet-08.svg">Start</v-img>
              </v-col>
              <v-col v-else>
                <v-img class="start-planet" @click="randomPrivate" src="../../../public/planet-01.svg">Start</v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <tutorial-dialog></tutorial-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                
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
import { useRouter } from "vue-router"
// import store from '@/store/gameStore';
import { reactive } from "vue"
// import { mapGetters } from 'vuex'

export default {
  name: 'MainPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      isTeam : null
    })
    const changeValue = function (value) {
      state.isTeam = value
      console.log(value)
    }
    // const randomTeam = async function () {
    //   const params = {
    //     isTeamBattle: state.isTeam
    //   }
    //   const result = await store.dispatch('gameStore/randomTeamAction', params)
    //   console.log(result)
    //   router.push({name: 'gameroom'})
    // }
    // const randomPrivate = async function () {
    //   const params = {
    //     isTeamBattle: state.isTeam
    //   }
    //   const result = await store.dispatch('gameStore/randomPrivateAction', params)
    //   console.log(result)
    //   router.push({name: 'gameroom'})
    // }
    return {
      store, 
      router, 
      state,
      changeValue,
      // randomTeam,
      // randomPrivate,
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

.start-planet {
  font-family: 'Akronim', cursive;
  font-size: 4rem;
  height: 10rem;
  display : flex;
  justify-content : center;
  align-items : center;
  color:white;
}
</style>