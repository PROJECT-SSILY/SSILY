<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }">
        <v-img 
        v-bind="attrs"
        @click.stop="state.dialog = true" 
        class="tutorial-planet" 
        src="@/assets/images/planet-13.svg"
        >
        Tutorial</v-img>
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          튜토리얼
        </v-card-title>
        <iframe width="500" height="300" src="https://www.youtube.com/embed/zuoSn3ObMz4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script>
    import { reactive } from 'vue'
    export default {
      name: 'TutorialDialog',
      setup() {
        const state = reactive({
          dialog: false,
        })
        return {
          state
        }
      }
      // data () {
      //   return {
      //     dialog: false,
      //     row: null,
      //     row2: null,
      //     rules: {
      //       required: value => !!value || '필수',
      //     }
      //   }
      // },
      // methods: {
      //   toWaiting() {
      //     this.$router.push({name: 'waiting'})
      //   }
      // }
    }
  </script>
  <style scoped>
  .tutorial-planet {
    font-family: 'Akronim', cursive;
    font-size: 2rem;
    height: 6rem;
    display : flex;
    justify-content : center;
    align-items : center;
    color:white;
    transform: translate(-9px, -15px);
  }
  @keyframes shake-tutorial-planet {
    0% { transform: translate(-8px, -14px); }
    33% { transform: translate(-10px, -14px); }
    66% { transform: translate(-10px, -16px); }
    100% { transform: translate(-8px, -16px); }
  }
  
  .tutorial-planet:hover {
    animation: shake-tutorial-planet .1s infinite alternate;
  }
  </style>