<template>
  <div class="list-users">
    <UserInfo
    class="list-users-item"
    v-for="user in userList"
    :user="user"
    :key="user.id"
    :class="clientNickname==user.nickname ?'active':''"
    />
    <div class="list-users-item blank"
    v-for="blank in 4-userList.length"
    :key="blank">
    </div>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import UserInfo from './components/UserInfo.vue';
import $axios from "axios";
import { computed } from 'vue'
import { useStore } from 'vuex';

$axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
  name: 'WaitingPage',
  components: {
    UserInfo,
  },
  props: {
    session: Object,
    myConnectionId: String,
    team: String,
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const clientNickname= computed(() => store.state.accountStore.user.nickname)
    const userList = computed(() => store.state.gameStore.userList)
    const isSecret = computed(() => store.state.gameStore.isSecret)
    const isHost = computed(() => store.state.gameStore.isHost)
    const myTeam = ref(props.team)
    const Id = ref(props.myConnectionId)

    return {
		router,
    Id,
    clientNickname,
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
  background: #b7b7b7;
  margin: 7px;
  box-shadow: 0 -1px 5px #00000025;
  position: relative;
}
.list-users-item.active {
  border: 3px solid #ffffff;
  background: #d8d8d8;
  box-shadow: 0 0 17px 3px #ffffff;
}
.blank {
  background: #ECECEC;
}
</style>