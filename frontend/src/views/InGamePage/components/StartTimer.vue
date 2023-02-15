<template>
    <div class="wrap-dialog">
      <div class="dialog">
        게임이 곧 시작됩니다.
        <v-progress-circular
        :rotate="-90"
        :size="100"
        :width="15"
        :model-value="value"
        color="primary"
      >
      {{ value }}
    </v-progress-circular>
      </div>    
    </div>
  </template>
    
    <script>
  export default {
    data () {
      return {
        interval: {},
        value: 0,
      }
    },
    beforeUnmount () {
      clearInterval(this.interval)
    },
    mounted () {
      this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0)
        }
        this.value += 20
      }, 400)
    },
  }
  </script>
    
  <style scoped>
  .v-progress-circular {
  margin: 1rem;
  }
  .dialog {
    width: 400px;
  }
  .text-caption {
    margin-bottom: 10px;
  }
  </style>
    