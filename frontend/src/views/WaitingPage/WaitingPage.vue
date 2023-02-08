<template>
  <div id="flex-container">
      <div class="userinfo-component flex-item">
        <UserInfo
        v-for="player in playerList"
        :player="player"
        :myConnectionId="myConnectionId"
        :myTeam="team"
        :key="player.id"/>
        <div class="userinfo_empty" 
        v-for="p in 4-playerList.length" 
        :key="p"
        ></div>
      </div>
    </div>
</template>
<script>
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { onUpdated } from 'vue'
import { useStore } from 'vuex';


$axios.defaults.headers.post['Content-Type'] = 'application/json';


export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
  },  
  props: {
    playerList: Object,
    session: Object,
    myConnectionId: String,
    sessionId: String,
    team: String,
  },
  emits: [
    'joinSession',
  ],
  setup(props, {emit}) {
    const router = useRouter()
    const store = useStore()
    const PlayerList = ref(props.playerList)
    const useritem = ref(null)
    const myTeam = ref(props.team)
    const Id = ref(props.myConnectionId)
    console.log(useritem.class)
    const state = reactive({
      team: null,
    })

    onUpdated(() => {
      state
      state.team = props.team
      PlayerList.value
      document.querySelector(".userinfo-component").innerHTML
    })

    const joinSession = async function() {
      emit('joinSession')
		}

    const sessionInfo = () => {
      const session1 = store.getters['gameStore/getSession']
      const sessionId1 = store.getters['gameStore/getSessionId']
      console.log('session클릭', session1)
      console.log('sessionId', sessionId1)
    }

    return {
		router,
		state,
		joinSession,
		sessionInfo,
    PlayerList,
    Id,
    myTeam,
    }
  }
}
</script>

<style>
.userinfo-component {
  padding: 0px 30px;
  max-width: 750px;
  min-width: 700px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* ------------------- */

.userinfo_empty {
  height: 297px;
  width: 297px;
  border-radius: 100%;
  box-sizing: content-box;
  display: inline-block;
  border: 5px dashed #ffffffa3;
}

</style>