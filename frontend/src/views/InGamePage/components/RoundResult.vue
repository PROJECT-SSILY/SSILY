<template>
  <v-row justify="center">
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
    <!-- <div v-if="endRound">
        <h1>{{ round }}round 결과</h1>
        <h1> {{ winnerNickname }} WON! </h1>
        <div v-for="user in sortedUserList"
        :user="user"
        :key="user.id">
            <h1>{{ user.nickname }} : {{ user.score }}점! </h1>
        </div>
        <v-btn @click="nextRound">다음 라운드로!</v-btn>
    </div> -->
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
    const endRound = computed(() => store.state.gameStore.endRound)
    const round = computed(() => store.state.gameStore.round)
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
      // nextRound
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