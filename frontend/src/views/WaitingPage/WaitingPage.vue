<template>
  <div id="flex-container">
    <PasswordInput
    v-if="isSecret && !isHost"/>
      <div class="userinfo-component flex-item">
          <UserInfo
          v-for="user in userList"
          :user="user"
          :key="user.id"/>
          <BlankBox
          v-for="blank in 4-userList.length"
          :key="blank"/>
      </div>
    </div>
</template>
<script>
import { ref } from '@vue/reactivity'
// import { isProxy, toRaw } from 'vue';
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { computed } from 'vue'
import { useStore } from 'vuex';
import BlankBox from './components/BlankBox.vue'
import PasswordInput from './components/PasswordInput.vue'

$axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
    BlankBox,
    PasswordInput
  },
  props: {
    session: Object,
    myConnectionId: String,
    team: String,
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const userList = computed(() => store.state.gameStore.userList)
    const isSecret = computed(() => store.state.gameStore.isSecret)
    const isHost = computed(() => store.state.gameStore.isHost)
    const myTeam = ref(props.team)
    const Id = ref(props.myConnectionId)

    return {
		router,
    Id,
    myTeam,
    userList,
    isSecret,
    isHost
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