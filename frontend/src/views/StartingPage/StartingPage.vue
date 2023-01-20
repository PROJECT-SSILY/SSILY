<template>
    <div>
      <v-btn @click="toLogin">Start</v-btn>
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
