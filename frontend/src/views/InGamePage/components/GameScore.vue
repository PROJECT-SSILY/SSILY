<template>
  <div class="score-box" v-if="!isTimeOut">
    <span id="score-board">SCORE BOARD</span>
    <p v-for="user in userList" :user="user" :key="user.id" class="my-score">
    <span id="nickname">{{ user.nickname }}</span><span id="score">{{ user.score }}점</span>
    </p>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "GameScore",
  setup() {
    const store = useStore();
    const userList = computed(() => store.state.gameStore.userList);
    return {
      store,
      userList,
    };
  },
};
</script>

<style>
.score-box {
  border-radius: 10px;
  border: 1px solid rgba(81, 255, 255, 0.6);
  box-shadow: 0 0 20px 3px rgba(81, 255, 255, 0.5);
  padding: 20px;
  width: 100%;
}
.my-score {
	color: white;
}
#nickname {
	font-size: 15px;
  margin-right: 15px;
}
#score {
	font-size: 20px;
	
}
#score-board {
  font-size: 30px;
  color: white;
  font-family: "Orbitron", sans-serif;
}
</style>