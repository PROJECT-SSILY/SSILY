<template>
  <!-- <v-list-item-title v-text="room.title"></v-list-item-title> -->
  <div><h3>{{ room.title }}</h3></div>
</template>

<script>
export default {
    props: {
        room: Object
    }
}
</script>

<style>

</style>