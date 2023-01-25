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
                <v-btn color="accent" large @click.stop="dialog = true">방 만들기</v-btn>
                <make-room-dialog 
                v-model="dialog"></make-room-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn>게임 시작</v-btn>
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
    dialog: false,
  };
},
components: {
  MakeRoomDialog,
  ProfileBox,
  RoomList
},
}
</script>
