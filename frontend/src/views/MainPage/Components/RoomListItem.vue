<template>
  <!-- <v-list-item-title v-text="room.title"></v-list-item-title> -->
  <v-row class="d-flex justify-space-between">
    <v-col md="8">
      <v-list-item-content>
        <h3>{{ room.title }}</h3>
      </v-list-item-content>
    </v-col>
    <v-col md="1">
      <v-list-item-icon>
        <v-icon :color="room.isSecret ? 'deep-purple accent-4' : 'grey'">
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