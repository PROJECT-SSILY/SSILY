<template>
    <div class="base-timer">
      <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  const TIME_LIMIT =  20;
  
  export default {
    data() {
      return {
        timePassed: 0,
        timerInterval: null
      };
    },
  
    computed: {
      ...mapState({
        endRound(state) {
          return state.gameStore.endRound
        },
        isHost(state) {
          return state.gameStore.isHost
        }
      }),
      formattedTimeLeft() {
        const timeLeft = this.timeLeft;
        // const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
  
        if (seconds < 60) {
          seconds = `${seconds}`;
        }
  
        return `${seconds}`;
      },
  
      timeLeft() {
        return TIME_LIMIT - this.timePassed;
      },
  
      timeFraction() {
        const rawTimeFraction = this.timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
      },
  
    },
  
    watch: {
      timeLeft(newValue) {
        if (newValue === 0) {
          // 타이머 종료 이벤트 여기에 !
          this.onTimesUp();
          if (this.isHost) {
            this.timeOver()
          }
        }
      },
      endRound(newValue) {
        if (newValue == true) {
          //console.log('타이머 리셋')
          // 라운드가 끝나면 타이머 리셋 - 수연
          this.onTimesUp();
          this.timePassed = 0
        } else {
          console.log('타이머 시작')
          // 라운드가 시작되면 타이머 시작
          this.startTimer();
        }
      }
    },
  
    mounted() {
      this.startTimer();
    },
  
    methods: {
      onTimesUp() {
        console.log("timerCheck : timesUp");
        clearInterval(this.timerInterval);
      },
  
      startTimer() {
        console.log("timerCheck : start");
        this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
        this.$store.commit('gameStore/setIsTimeOut', false)
      },
      timeOver() {
        console.log("timerCheck : Over");
        this.$store.dispatch('gameStore/timeOverRound')
      }
    }
    
    
  };
  </script>
  
  <style scoped>
  </style>
  