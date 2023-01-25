<template>
    <div>
      <v-btn @click="toLogin">Start</v-btn>
      <img src="./images/rocket.svg" alt="">
    </div>
</template>
  
<script>

export default {
name: 'StartingPage',
methods: {
    toLogin() {
        this.$router.push({name: 'Login'})
    }
}

}
</script>

<style>
</style>

