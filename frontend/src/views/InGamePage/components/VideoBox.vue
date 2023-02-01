<template>
  <div>
    <div v-if="video.me">
      <v-btn @click="test">test</v-btn>
      <div v-if="state.isDrawer">
        <MyCanvasBox/>
        <h1>작은 내 얼굴</h1>
      </div>
      <div v-else>
        <h1>내 얼굴</h1>
      </div>
    </div>
    <div v-else>
      <h1>상대방 비디오</h1>
    </div>
    
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import MyCanvasBox from './MyCanvasBox.vue'
export default {
  components: {
    MyCanvasBox,
  },
  props: {
    video: Object
  },
  setup() {
    const state = reactive({
      isDrawer: true
    })    
    const test = () => {
      state.isDrawer = !state.isDrawer
    }
    return {
      state,
      test
    }
  }
}
</script>

<style>

</style>