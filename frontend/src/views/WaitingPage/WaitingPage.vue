<template>
  <div id="flex-container">
      <div class="userinfo-component flex-item">
        <UserInfo
        v-for="one in PlayerList"
        :player="one.player"
        :myConnectionId="one.connectionId"
        :myTeam="one.player.team"
        :key="one.id"/>
        
        <BlankBox
        v-for="index in emptyUser"
        :key="index.id"
        />
      </div>
    </div>
</template>
<script>
import { reactive, ref } from '@vue/reactivity'
import { isProxy, toRaw } from 'vue';
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { onUpdated, onMounted } from 'vue'
import { useStore } from 'vuex';
import BlankBox from './components/BlankBox.vue'

$axios.defaults.headers.post['Content-Type'] = 'application/json';


export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
    BlankBox,
  },  
  props: {
    playerList: Object,
    session: Object,
    myConnectionId: String,
    sessionId: String,
    team: String,
  },
  // emits: [
  //   'joinSession',
  // ],
  setup(props) {
    const router = useRouter()
    const store = useStore()
    // const PlayerList = computed(() => props.playerList)
    const PlayerList = ref(props.playerList)
    const emptyUser = [];
    const useritem = ref(null)
    const myTeam = ref(props.team)
    const Id = ref(props.myConnectionId)
    console.log(useritem.class)
    const state = reactive({
      team: null,
    })

    onMounted(() =>{
      let rawData= props.playerList;
      if(isProxy(props.playerList)){
        rawData = toRaw(props.playerList);
      }
      console.log("testing", rawData);
      
      for(var i=0;i<4;i++){
        const myValue={id : i };
        emptyUser.push(myValue);
      }
      for(let one in rawData){
        console.log(one);
        // emptyUser.value pop();
      }
      console.log("emptyUser is ", emptyUser);
    })

    // console.log("emptyUser.value@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ : ", emptyUser.value)

    onUpdated(() => {
      state
      state.team = props.team
      // PlayerList.value
      document.querySelector(".userinfo-component").innerHTML
    })

    // const joinSession = async function() {
    //   emit('joinSession')
		// }

    const sessionInfo = () => {
      const session1 = store.getters['gameStore/getSession']
      const sessionId1 = store.getters['gameStore/getSessionId']
      console.log('session클릭', session1)
      console.log('sessionId', sessionId1)
    }

    return {
		router,
		state,
    // emptyUser,
		// joinSession,
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

</style>