<template>
  <v-row justify="center">
    <v-dialog
      v-model="endGame"
      persistent
      max-width="1000"
    >
      <v-card class="formbox">
        <v-card-title>
          게임 결과
        </v-card-title>
        <v-card-text>
          <div v-for="winner in winnerList"
          :winner="winner"
          :key="winner.id">
            <h1>{{ winner }}</h1>
          </div> <h1>WON!</h1>
          <div v-for="(user, index) in gameResult"
          :user="user"
          :key="user.id">
              <h1>{{ parseInt(index) + 1 }}등 {{ user.nickname }} + {{ user.extraExp }} Exp </h1>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @Click="clickReturn"
          >
          돌아가기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
import { useStore } from 'vuex';
import { computed } from "vue";


export default {
  name: 'GameResult',
  setup() {
    const store = useStore()
    const endGame = computed(() => store.state.gameStore.endGame);
    const gameResult = computed(() => store.state.gameStore.gameResult)
    const readyAll = computed(() => store.state.gameStore.isAllReady);
    const winnerList = computed(() => store.state.gameStore.winnerList)
    const sortedUserList = computed(() => store.state.gameStore.sortedUserList)
    const clickReturn = () => { // 나가기 버튼 없애고, 돌아가기 버튼만 활용
      store.commit('gameStore/setEndGame', false)
      store.commit("gameStore/setInGame", false)
      store.commit("gameStore/setIsAllReady", false)
      store.commit("gameStore/setAudioStatus", false)
    }
  return {
    gameResult,
    store,
    endGame,
    readyAll,
    clickReturn,
    winnerList,
    sortedUserList
  }
  }
}
</script>

<style scoped>
.formbox {
  padding: 2rem;
  width: 100%;
  border-radius: 20px;
  opacity: 100%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
</style>