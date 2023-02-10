<template>
<!-- <p>{{streamManager}}</p> -->
<div v-if="streamManager">
	<ov-video :stream-manager="streamManager" class="video"/>
</div>
</template>

<script>
import OvVideo from './OvVideo';

export default {
	name: 'UserVideo',

	components: {
		OvVideo,
	},

	props: {
		streamManager: Object,
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
	border-radius: inherit;
	background: black;
}
</style>
