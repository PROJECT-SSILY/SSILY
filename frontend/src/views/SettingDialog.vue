<template>
    <div>
      <v-row justify="center">
        <v-btn
          color="primary"
          @click="clickDialog"
        >
          설정
        </v-btn>
        <audio id="audioContainer" src="https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3" volume="0.5" loop></audio>
        <v-btn
          @click="play">
          음악
        </v-btn>
        <v-dialog
          v-model="state.dialog"
        ><v-card>
          <div class="text-caption">배경음악</div>
          <v-slider
            v-model="state.volume1"
            :max="state.max"
            :min="state.min"
            @click="clickSlider1"
            @mouseup="clickSlider1"
            @mouseleave="clickSlider1"
            prepend-icon="mdi-volume-high"
          ></v-slider>
          <div class="text-caption">효과음</div>
          <v-slider
            v-model="state.volume2"
            :max="state.max"
            :min="state.min"
            @click="clickSlider2"
            @mouseup="clickSlider2"
            @mouseleave="clickSlider2"
            prepend-icon="mdi-volume-high"
          ></v-slider>
        </v-card>
        </v-dialog>
      </v-row>
    </div>
  </template>
  
  <script>
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
    export default {
      setup() {
        const store = useStore()
        const state = reactive({
          dialog: false,
          max: 1,
          min: 0,
          volume1: 0,
          volume2: 0,
        })
        const clickDialog = () => {
          state.volume1 = store.state.gameStore.media
          state.volume2 = store.state.gameStore.alarm
          state.dialog = !state.dialog
        }
        // const media = computed(()=> store.state.gameStore.media)
        const clickSlider1 = () => {
          console.log('media전: ',store.state.gameStore.media)
          store.dispatch('gameStore/changeVolume1', state.volume1)
          console.log('media후: ',store.state.gameStore.media)
        }

        const clickSlider2 = () => {
          console.log('alarm 전: ',store.state.gameStore.alarm)
          store.dispatch('gameStore/changeVolume2', state.volume2)
          console.log('alarm 후: ',store.state.gameStore.alarm)
        }

        return { store, state, clickSlider1, clickSlider2, clickDialog, onMounted }
      }

      // data: () => ({
      //   dialog: false,
      //   media: 0.5,
      //   alarm: 0.5,
      //   max: 1,
      //   min: 0,
      // }),
      // methods: {
      //   play() {
      //     console.log('음악 클릭')
      //     const source = document.querySelector('#audioContainer')
      //     this.media = source.volume
      //     source.play();
      // },



        // clickSlider() {
        //   console.log(this.media)
        //   const source = document.querySelector('#audioContainer')
        //   source.volume = this.media;
        // }
    // }
  }
  </script>
  
  <style>
  
  </style>
  