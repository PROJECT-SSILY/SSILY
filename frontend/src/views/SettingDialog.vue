<template>
    <div>
      <v-row justify="center">
        <v-btn
          color="primary"
          @click="dialog=!dialog"
        >
          Open Dialog
        </v-btn>
        <audio id="audioContainer" src="https://ccrma.stanford.edu/~jos/mp3/harpsi-cs.mp3" volume="0.5" loop></audio>
        <v-btn
          @click="play">
          음악
        </v-btn>
        <v-dialog
          v-model="dialog"
        ><v-card>
          <div class="text-caption">배경음악</div>
          <v-slider
            v-model="media"
            :max="max"
            :min="min"
            @click="clickSlider"
            @mouseup="clickSlider"
            @mouseleave="clickSlider"
            prepend-icon="mdi-volume-high"
          ></v-slider>
          <div class="text-caption">효과음</div>
          <v-slider
            v-model="alarm"
            :max="max"
            :min="min"
            prepend-icon="mdi-volume-high"
          ></v-slider>
        </v-card>
        </v-dialog>
      </v-row>
    </div>
  </template>
  
  <script>
    export default {
      data: () => ({
        dialog: false,
        media: 0.5,
        alarm: 0.5,
        max: 1,
        min: 0,
      }),
      methods: {
        play() {
          console.log('음악 클릭')
          const source = document.querySelector('#audioContainer')
          this.media = source.volume
          source.play();
      },
        clickSlider() {
          console.log(this.media)
          const source = document.querySelector('#audioContainer')
          source.volume = this.media;
        }
    }
  }
  </script>
  
  <style>
  
  </style>
  