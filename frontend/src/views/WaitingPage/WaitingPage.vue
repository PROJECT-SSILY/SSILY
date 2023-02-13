<template>
  <div class="list-users">
    <PasswordInput
    v-if="isSecret && !isHost"/>
          <UserInfo
          class="list-users-item"
          v-for="user in userList"
          :user="user"
          :key="user.id"
          />
          <div class="list-users-item blank"
          v-for="blank in 4-userList.length"
          :key="blank"></div>
      </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { computed } from 'vue'
import { useStore } from 'vuex';
import PasswordInput from './components/PasswordInput.vue'

$axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
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

/* ------------------- */
.list-users {
  display: flex;
  flex-direction: row;
}
.list-users-item {
  width: 161px;
  height: 161px;
  border-radius: 30px;
  background: #ffffff;
  padding: 10px;
  margin: 7px;
  box-shadow: 0 -1px 5px #00000025;
}
.blank {
  background: #ECECEC;
}
</style>