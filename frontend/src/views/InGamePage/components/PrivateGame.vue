<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <video-box
          v-for="video in opponentTeam"
          :key="video.id"
          :video="video"
          />
        </v-col>
        <v-col>
          <video-box
          v-for="video in myTeam"
          :key="video.id"
          :video="video"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
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
      }
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
      {
        id: 3,
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