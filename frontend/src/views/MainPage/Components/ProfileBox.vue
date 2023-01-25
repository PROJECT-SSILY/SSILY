<template>
    <div>
      <v-container>
        <v-row>
          <v-col id="proleft">
            <v-row>
              <v-col>어서오세요, {{}}님!</v-col>
            </v-row>
            <v-row justify="center">
              <v-col id="btnbox">
                <v-btn>Setting</v-btn>
                <v-btn>Logout</v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script>

export default {
name: 'ProfileBox',

}
</script>

<style scoped>
#btnbox {
  display: flex;
}
#proright {
  display: flex;
}
</style>
