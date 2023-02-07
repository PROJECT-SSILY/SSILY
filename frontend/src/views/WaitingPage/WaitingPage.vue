<template>
  <div id="flex-container">
      <div class="userinfo-component flex-item">
        <!-- <p>{{ playerList }}</p> -->
          <UserInfo/>
          <BlankBox/>
      </div>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
// import { isProxy, toRaw } from 'vue';
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
    // const emptyUser = [];
    // const useritem = ref(null)
    const myTeam = ref(props.team)
    const Id = ref(props.myConnectionId)
    // console.log(useritem.class)

    onMounted(() =>{
      // let rawData= props.playerList;
      // if(isProxy(props.playerList)){
      //   rawData = toRaw(props.playerList);
      // }
      // console.log("testing", rawData);
      // console.log("PlayerList : ", props.playerList)
      // for(var i=0;i<4;i++){
      //   const myValue={id : i };
      //   emptyUser.push(myValue);
      // }
      // for(let one in rawData){
      //   console.log(one);
      //   // emptyUser.value pop();
      // }
      // console.log("emptyUser is ", emptyUser);
      // console.log("현재 남은 칸 : ", 4-PlayerList.value.length)
    })

    // console.log("emptyUser.length : ", emptyUser.length)


    onUpdated(() => {
      // console.log(props.team)
      document.querySelector(".userinfo-component").innerHTML
    })

    const sessionInfo = () => {
      const session1 = store.getters['gameStore/getSession']
      const sessionId1 = store.getters['gameStore/getSessionId']
      console.log('session클릭', session1)
      console.log('sessionId', sessionId1)
    }

    return {
		router,
		sessionInfo,
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