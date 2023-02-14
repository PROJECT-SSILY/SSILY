<template>
  <div class="score-box" v-if="!isTimeOut">
    <p v-for="user in userList" :user="user" :key="user.id" class="my-score">
		<span id="score">{{ user.score }}개</span><span id="nickname">{{ user.nickname }}</span>
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
.my-score {
	color: white;
}
#nickname {
	font-size: 15px;
}
#score {
	font-size: 20px;
	margin-right: 15px;
}
</style>