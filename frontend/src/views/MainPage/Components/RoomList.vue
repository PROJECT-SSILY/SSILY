<template>
    <div>
      <h3>
        RoomList
      </h3>
      <v-card
        class="mx-auto"
        max-width="500"
      >
        <v-toolbar
          color="deep-purple accent-4"
          dark
        >
          <v-row>
            <v-col class="title">
              <h3>방 제목</h3>
            </v-col>
            <v-col>
                <v-switch
                v-model="state.switch1"
                :label="`모드: ${state.switch1 ? '개인':'팀'}`"
                color="orange darken-3"
                hide-details
                ></v-switch>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-list subheader v-if="state.switch1">
          <v-list-item
            v-for="room in state.privaterooms"
            :key="room.title"
          >
            <v-row class="d-flex justify-space-between">
              <v-col cols="10"> 
                <v-list-item-content>
                  <v-list-item-title v-text="room.title"></v-list-item-title>
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
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
        <v-list subheader v-else>
          <v-list-item
            v-for="room in state.teamrooms"
            :key="room.title"
          >
          <v-row class="d-flex justify-space-between">
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title v-text="room.title"></v-list-item-title>
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
          <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </v-card>      
    </div>
  </template>
  
<script>
import { reactive } from "vue";
export default {
  name: 'RoomList',
  setup() {
    const state = reactive({
      privaterooms: [
          {
            secret: true,
            title: '들어오시죠',
          },
          {
            secret: true,
            title: 'I 3D U',
          },
          {
            secret: false,
            title: 'Draw me if you catch',
          },
          {
            secret: false,
            title: '재밌다',
          },
        ],
        teamrooms: [
          {
            secret: true,
            title: '여기는',
          },
          {
            secret: true,
            title: '팀전',
          },
          {
            secret: false,
            title: '섹션입니다',
          },
          {
            secret: false,
            title: '짱~~',
          },
        ],
        switch1: true,
    })
    return {
      state
    }
  }
}
</script>

<style scoped>

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

</style>