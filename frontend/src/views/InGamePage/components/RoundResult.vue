<template>
    <div v-if="endRound">
        <div v-if="endGame">
            <h1>{{ gameResult }}</h1>
        </div>
        <h1>{{ round }}round 결과</h1>
        <h1> {{ winnerNickname }} WON! </h1>
        <div v-for="user in sortedUserList"
        :user="user"
        :key="user.id">
            <h1>{{ user.nickname }} : {{ user.score }}점! </h1>
        </div>
        <v-btn @click="nextRound">다음 라운드로!</v-btn>
    </div>
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
    const state = reactive({
      winner: '',
    })
    const nextRound = () => {
        store.dispatch('gameStore/changeRoundEnd', false)
    }
    return {
      store,
      state,
      endRound,
      sortedUserList,
      winnerNickname,
      round,
      gameResult,
      nextRound,
      endGame
    }
  }
}
</script>

<style>

</style>