<template>
  <!-- <v-list-item-title v-text="room.title"></v-list-item-title> -->
  <v-row class="d-flex justify-space-between">
    <v-col cols="10">
      <v-list-item-content>
        <h3>{{ room.title }}</h3>
      </v-list-item-content>
    </v-col>
    <v-col>
      <v-list-item-icon>
        <v-icon v-if="room.isSecret"
          color="blue-grey darken-2">
          mdi-lock-outline
        </v-icon>
      </v-list-item-icon>
    </v-col>
  </v-row>
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