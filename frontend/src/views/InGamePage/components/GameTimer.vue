<template>
    <div class="base-timer">
      <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';

  const TIME_LIMIT =  400;
  
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
        },
        preventSubmit(state) {
          return state.gameStore.preventSubmit
        }
      }),
      formattedTimeLeft() {
        const timeLeft = this.timeLeft;
        let second = parseInt(timeLeft / 10);

        return `${second}`;
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
        } else if (newValue === 7) { // 0.7초 남았을 때 제출 막기 위해 추가
          console.log("0.7초 입니다~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          this.$store.commit('gameStore/setPreventSubmit', true)
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
          // 1초 남았을 때 제출 막기 위해 추가
          this.$store.commit('gameStore/setPreventSubmit', false)
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
        this.timerInterval = setInterval(() => (this.timePassed += 1), 100);
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
  