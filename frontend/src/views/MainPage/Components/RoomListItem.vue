<template>
  <!-- <v-list-item-title v-text="room.title"></v-list-item-title> -->
  <v-row class="d-flex justify-space-between">
    <v-col cols="10">
      <v-list-item-content>
        {{ room.title }}
      </v-list-item-content>
    </v-col>
    <v-col>
      <v-list-item-icon>
        <v-icon :color="room.secret ? 'deep-purple accent-4' : 'grey'">
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