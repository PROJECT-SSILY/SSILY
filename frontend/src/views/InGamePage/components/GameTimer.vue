<template>
  <div>
    <h1>{{min}}:{{sec}}</h1><br/>
    <v-btn class="btn btn-success" @click="start" :disabled="!isTimerRunning">Start</v-btn>
    <v-btn class="btn btn-warning" v-on="isTimerPaused ? { click: start } : { click : pause }" :disabled="isTimerRunning">{{isTimerPaused ? 'Resume' : 'Pause'}}</v-btn>
    <v-btn class="btn btn-danger" @click="reset" :disabled="isTimerRunning">Reset</v-btn>
</div>
</template>
<script>
const TIMER_STATE = {
    running: 'Running',
    stopped: 'Stopped',
    paused: 'Paused'
};
export default {
  data(){
      return{
          timerMinutes: 0,
          timerSeconds: 0,
          timerState : TIMER_STATE.stopped
      }
  },
  props:{
      totalMinutes: {
          type: Number,
          default: 1
      },
      totalSeconds: {
          type: Number,
          default: 0
      }
  },
  mounted(){
      this.timerMinutes = this.totalMinutes;
      this.timerSeconds = this.totalSeconds;
  },
  methods:{
      start(){
          this._tick();
          this.ticking = setInterval(this._tick, 1000);
          this.timerState = TIMER_STATE.running;
      },
      pause(){
          clearInterval(this.ticking);
          this.timerState = TIMER_STATE.paused;
      },
      reset(){
          this.timerMinutes = this.totalMinutes;
          this.timerSeconds = this.totalSeconds;
          clearInterval(this.ticking);
          this.timerState = TIMER_STATE.stopped;
      },

      _tick(){
          if(this.timerSeconds !== 0){
              this.timerSeconds--;
              return
          }

          if(this.timerMinutes !== 0){
              this.timerMinutes--;
              this.timerSeconds = 59;
              return;
          }
      }
  },
  computed: {
      min() {
          if(this.timerMinutes < 10){
              return '0'+this.timerMinutes;
          }
          return this.timerMinutes;
      },
      sec() {
          if(this.timerSeconds < 10){
              return '0'+this.timerSeconds;
          }
          return this.timerSeconds;
      },
      isTimerRunning(){
          return this.timerState === 'Stopped';
      },
      isTimerPaused(){
          return this.timerState == 'Paused';
      }
  }
}
</script>
