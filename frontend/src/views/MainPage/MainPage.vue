<template>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <h1>메인 화면</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <room-list></room-list>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <profile-box></profile-box>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <make-room-dialog></make-room-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="success"
                >
                게임 시작</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn>튜토리얼</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script>

import MakeRoomDialog from './Components/MakeRoomDialog.vue';
import ProfileBox from './Components/ProfileBox.vue';
import RoomList from './Components/RoomList.vue';

export default {
name: 'MainPage',
data() {
  return {
  };
},
components: {
  MakeRoomDialog,
  ProfileBox,
  RoomList
},
}
</script>

<style scoped>

</style>