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
      <v-toolbar-title>방 제목</v-toolbar-title>
      <v-switch
      v-model="switch1"
      :label="`모드: ${switch1 ? '개인':'팀'}`"
      color="orange darken-3"
      hide-details
    ></v-switch>

    </v-toolbar>

    <v-list subheader v-if="switch1">
      <v-list-item
        
        v-for="room in privaterooms"
        :key="room.title"
      >
      
      <v-list-item-avatar>
      </v-list-item-avatar>
      
      <v-list-item-content>
        <v-list-item-title v-text="room.title"></v-list-item-title>
      </v-list-item-content>
      
      <v-list-item-icon>
        <v-icon :color="room.secret ? 'deep-purple accent-4' : 'grey'">
          mdi-lock-outline
        </v-icon>
      </v-list-item-icon>
      <v-divider></v-divider>
      </v-list-item>
    </v-list>
    <v-list subheader v-else>
      <v-list-item
        
        v-for="room in teamrooms"
        :key="room.title"
      >
      
      <v-list-item-avatar>
      </v-list-item-avatar>
      
      <v-list-item-content>
        <v-list-item-title v-text="room.title"></v-list-item-title>
      </v-list-item-content>
      
      <v-list-item-icon>
        <v-icon :color="room.secret ? 'deep-purple accent-4' : 'grey'">
          mdi-lock-outline
        </v-icon>
      </v-list-item-icon>
      <v-divider></v-divider>
      </v-list-item>
    </v-list>

  </v-card>      
    </div>
  </template>
  
<script>

export default {
name: 'RoomList',
data: () => ({
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
      
    }),
}
</script>
