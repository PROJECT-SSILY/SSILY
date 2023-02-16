<template>
<!-- <p>{{streamManager}}</p> -->
<div v-if="streamManager">
	<ov-video :stream-manager="streamManager" class="video"/>
	<div id=nickname>{{ isMyNickname }}</div>
</div>
</template>

<script>
import OvVideo from './OvVideo';
import { mapState } from 'vuex';

export default {
	name: 'UserVideo',

	components: {
		OvVideo,
	},
	props: {
		streamManager: Object,
		userId: String,
	},
	computed: {
		...mapState({
			userList(state) {
				return state.gameStore.userList
			},
			myConnectionId(state) {
				return state.gameStore.myConnectionId
			}
		}),
		isMyNickname() {
			var name = ''
			for (var i=0; this.userList.length > i; i++) {
				if (this.userList[i].connectionId == this.userId ){
					name = this.userList[i].nickname
				}
			}
			return name
		}
	},

	methods: {
		getConnectionData () {
			const { connection } = this.streamManager.stream;
			return JSON.parse(connection.data);
		},
	},
};
</script>
<style scoped>
.video {
	width: inherit;
	height: inherit;
	border-radius: inherit;
	background: black;
}
#nickname {
	position: absolute;
    bottom: 2px;
    color: white;
    margin: 0 auto;
    width: 100%;
    font-weight: 100;
	opacity: .7;
	font-size: 13px;
	font-family: "Orbitron", sans-serif;
}
</style>
