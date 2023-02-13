<template>
  <p class="wrap-item">
    <span id="num-members">{{ room.connections.numberOfElements }} / 4</span>
    <span id="tit-room">{{ room.title }}</span>
    <span class="ico-secret" :class="room.isSecret ? 'secret' : ''"><v-img src="@/assets/images/secret.svg" alt="secret"/></span>
  </p>
</template>
<script>
// import { useRouter } from "vue-router";
// import { useStore } from "vuex";
export default {
  props: {
    room: Object,
  },
  setup() {
    // const router = useRouter();
    // const store = useStore();
    // const getInRoom = function (params) {
    //   const roominfo = JSON.parse(JSON.stringify(params));
    //   store.commit("gameStore/setTitle", roominfo.title);
    //   store.commit("gameStore/setTeam", roominfo.isTeamBattle);
    //   store.commit("gameStore/setIsSecret", roominfo.isSecret);
    //   store.commit("gameStore/setPassword", roominfo.password);
    //   router.push({
    //     name: "gameroom",
    //     params: { sessionId: roominfo.sessionId },
    //   });
    // };
    return {
      // router,
      // store,
      // getInRoom,
    };
  },
};
</script>

<style>
.wrap-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
#num-members {
  margin: 0 20px;
}
#tit-room {
  font-size: 15px;
  line-height: initial;
  font-weight: 600;
}
.ico-secret {
  margin: 0 20px;
  width: 20px;
  visibility: hidden;
}
.ico-secret.secret {
  visibility: visible;
}
</style>