<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>상대 팀</h1>
        <video-box
        v-for="video in opponentTeam"
        :key="video.id"
        :video="video"
        />
      </v-col>
      <v-col>
        <h1>우리 팀</h1>
        <video-box
        v-for="video in myTeam"
        :key="video.id"
        :video="video"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { reactive } from '@vue/reactivity'

import VideoBox from './VideoBox.vue'
export default {
  components: { VideoBox },
  name: "PrivateGame",
  setup() {
    const myTeam = [
      {
        id: 1,
        me: true
      },
      {
        id: 2,
        me: false
      },
    ]
    const opponentTeam = [
      {
        id: 1,
        me: false
      },
      {
        id: 2,
        me: false
      },
    ]
    return {
      myTeam,
      opponentTeam
    }
  }
}
</script>

<style>

</style>