<template>
  <v-row justify="center" v-if="!isTimeOut">
    <v-dialog
      v-model="endRound"
      persistent
      max-width="1000"
    >
      <v-card class="formbox">
        <v-card-title>
          {{ round }}round 결과
        </v-card-title>
        <v-card-text>
          <h1> {{ winnerNickname }} WON! </h1>
          <div v-for="user in sortedUserList"
          :user="user"
          :key="user.id">
              <h1>{{ user.nickname }} : {{ user.score }}점! </h1>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
          >
          다음 라운드로!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
 <v-row justify="center" v-if="isTimeOut">
    <v-dialog
      v-model="endRound"
      persistent
      max-width="1000"
    >
      <v-card class="formbox">
        <v-card-title>
          {{ round }}round 결과
        </v-card-title>
        <v-card-text>
          <h1> 정답자가 없습니다! </h1>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
          >
          다음 라운드로!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex';
import { computed } from "vue";

export default {
    name: 'RoundResult',
    setup() {
    const store = useStore()
    const sortedUserList = computed(() => store.state.gameStore.sortedUserList)
    const winnerNickname = computed(() => store.state.gameStore.winnerNickname)
    const gameResult = computed(() => store.state.gameStore.gameResult)
    const endRound = computed(() => store.state.gameStore.endRound)
    const round = computed(() => store.state.gameStore.round)
    const endGame = computed(() => store.state.gameStore.endGame)
    const isTimeOut = computed(() => store.state.gameStore.isTimeOut)
    const state = reactive({
      winner: '',
    })
    setInterval(() => {
        store.dispatch('gameStore/changeRoundEnd', false)
      }, 5000)
    
    return {
      store,
      state,
      endRound,
      sortedUserList,
      winnerNickname,
      round,
      gameResult,
      endGame,
      isTimeOut

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