<template>
	<div></div>
	<!-- <v-row justify="center" v-if="!isTimeOut">
		<v-dialog v-model="endRound" persistent max-width="1000" v-if="!endGame">
			<v-card class="formbox">
				<v-card-title> {{ round - 1 }}round 결과 </v-card-title>
				<canvas class="canvas" width="600" height="300" id="aCanvas"></canvas>
				<v-card-text>
					<h1>{{ winnerNickname }} WON!</h1>
					<div v-for="user in sortedUserList" :user="user" :key="user.id">
						<h1>{{ user.nickname }} : {{ user.score }}점!</h1>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
	<v-row justify="center" v-if="isTimeOut">
		<v-dialog v-model="endRound" persistent max-width="1000">
			<v-card class="formbox">
				<v-card-title> {{ round - 1 }}round 결과 </v-card-title>
				<v-card-text>
					<h1>정답자가 없습니다!</h1>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row> -->
</template>

<script>
import { reactive } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "vue";
import Swal from "sweetalert2";
export default {
	name: "RoundResult",
	setup() {
		const store = useStore();
		const sortedUserList = computed(() => store.state.gameStore.sortedUserList);
		const winnerNickname = computed(() => store.state.gameStore.winnerNickname);
		const gameResult = computed(() => store.state.gameStore.gameResult);
		const endRound = computed(() => {
			return store.state.gameStore.endRound;
		});
		const round = computed(() => {
			// imageToCanvas();
			return store.state.gameStore.round;
		});
		const endGame = computed(() => store.state.gameStore.endGame);
		const isTimeOut = computed(() => store.state.gameStore.isTimeOut);
		const state = reactive({
			winner: "",
		});

		const timeOutContent = "<h1>정답자가 없습니다!!</h1>";
		const answerContent =
			`<div>${winnerNickname.value} WON!!</div>` +
			'<canvas class="canvas" width="600" height="300" id="aCanvas"></canvas>' +
			sortedUserList.value
				.map((user) => `<div>${user.nickname} : ${user.score}점</div>`)
				.join("");
		// onMounted(()=>{
		//   imageToCanvas();
		// });
		// const imageToCanvas = async function () {
		// 	if (!isTimeOut.value) {
		// 		const getFile = await store.dispatch("gameStore/downloadImage");

		// 		var myCanvas = document.getElementById("aCanvas");
		// 		var ctx = myCanvas.getContext("2d");
		// 		var img = new Image();
		// 		img.src = getFile;
		// 		img.onload = function () {
		// 			ctx.drawImage(img, 0, 0); // Or at whatever offset you like
		// 		};
		// 	}
		// };
		// setInterval(() => {
		// 	store.dispatch("gameStore/changeRoundEnd", false);
		// }, 10000);

		let timerInterval;
		Swal.fire({
			title: round.value - 1 + "round 결과",
			html: '<div id="alertDiv"></div>',
			timer: 10000,
			timerProgressBar: true,
			didOpen: async () => {
				if (!isTimeOut.value && !endGame.value) {
					Swal.getHtmlContainer().innerHTML = answerContent;
				} else if (isTimeOut.value) {
					Swal.getHtmlContainer().innerHTML = timeOutContent;
				}

				Swal.showLoading();
				// const b = Swal.getHtmlContainer().querySelector('b')
				// // timerInterval = setInterval(() => {
				// //   b.textContent = Swal.getTimerLeft()
				// // }, 100)
				// b.textContent=(round-1);
				if (!isTimeOut.value) {
					const getFile = await store.dispatch("gameStore/downloadImage");
					const myCanvas = Swal.getHtmlContainer().getElementById("aCanvas");
					var ctx = myCanvas.getContext("2d");
					var img = new Image();
					img.src = getFile;
					img.onload = function () {
						ctx.drawImage(img, 0, 0); // Or at whatever offset you like
					};
				}
			},
			willClose: () => {
				clearInterval(timerInterval);
			},
		}).then((result) => {
			/* Read more about handling dismissals below */
			if (result.dismiss === Swal.DismissReason.timer) {
				store.dispatch("gameStore/changeRoundEnd", false);
			}
		});

		return {
			store,
			state,
			endRound,
			sortedUserList,
			winnerNickname,
			round,
			gameResult,
			endGame,
			isTimeOut,
		};
	},
};
</script>

<style scoped>
.formbox {
	padding: 2rem;
	width: 100%;
	border-radius: 20px;
	opacity: 100%;
	font-family: "MaplestoryOTFBold";
	font-weight: normal;
	font-style: normal;
}
</style>