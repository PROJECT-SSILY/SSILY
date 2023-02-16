<template>
  <v-row justify="center">
    <v-dialog class="result-dialog"
      v-model="endGame"
      persistent
    >
      <v-card class="formbox">
        <v-card-text class="inner-result">
          <div class="box-winner">
            <h1>WINNER</h1>
            <div class="list-winner">
            <span v-for="winner in winnerList"
            :winner="winner"
            :key="winner.id"
            class="winner">
              {{ winner }}!&nbsp;
            </span>
          </div>
          </div>
          <div class="box-users">
            <div v-for="(user, index) in gameResult"
            :user="user"
            :key="user.id">
            <p v-html="rankContent(index,user)"></p>
            </div>
          </div>
              <!-- <h1>{{ parseInt(index) + 1 }}등 {{ user.nickname }} + {{ user.extraExp }} Exp </h1> -->
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

    let rankIndex = 0;
    let rankValue = null;
    const rankContent = (key, value) => {
      if (rankValue == value.extraExp) {
        //공동 n등
        if (value.levelUp) {
          return `<h2> ${parseInt(rankIndex) + 1}등 ${value.nickname} + ${
          value.extraExp
        } Exp <span id="ico-levelup">Level Up!</span></h2>`;
        } else {
          return `<h2> ${parseInt(rankIndex) + 1}등 ${value.nickname} + ${
          value.extraExp
        } Exp </h2>`;
        }
      } else {
        rankIndex = key;
        rankValue = value.extraExp;
      }
      return `<h2> ${parseInt(rankIndex) + 1}등 ${value.nickname} + ${
        value.extraExp
      } Exp</h2>`;
    };

  return {
    gameResult,
    store,
    endGame,
    readyAll,
    clickReturn,
    winnerList,
    rankContent,
    sortedUserList
  }
  }
}
</script>

<style scoped>

.winnerStyle{
  font-size: 40px;
  text-align: center;
}
.result-dialog {
  font-family: 'KOFIHDrLEEJWTTF-B';
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  max-width: 800px;
  padding: 40px;
}
.formbox {
  padding: 60px 30px 20px 30px;
  width: 100%;
  border-radius: 20px;
  opacity: 100%;

}
.v-dialog .v-overlay__content > .v-card {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
  }
.inner-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.box-winner {
  text-align: center;
  margin-bottom: 30px;
}
.winner {
  font-size: 50px;
}
.box-users {
  width: auto;
}
#ico-levelup {
  background: linear-gradient(90deg, rgb(219 130 130) 0%, rgb(249 215 155) 24%, rgb(71 246 137) 47%, rgb(102 206 199) 62%, rgb(146 92 233) 84%, rgb(186 91 220) 100%);
  color: transparent;
  -webkit-background-clip: text;
}
</style>