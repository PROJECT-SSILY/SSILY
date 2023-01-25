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
      <v-toolbar-title>New Chat</v-toolbar-title>
      <v-switch
      v-model="ex11"
      label=""
      color="orange darken-3"
      value="orange darken-3"
      hide-details
    ></v-switch>

    </v-toolbar>

    <v-list subheader>

      <v-list-item
        v-for="chat in recent"
        :key="chat.title"
      >
      
      <v-list-item-avatar>
      </v-list-item-avatar>
      
      <v-list-item-content>
        <v-list-item-title v-text="chat.title"></v-list-item-title>
      </v-list-item-content>
      
      <v-list-item-icon>
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
      recent: [
        {
          active: true,
          title: '들어오시죠',
        },
        {
          active: true,
          title: 'I 3D U',
        },
        {
          active: true,
          title: 'Draw me if you catch',
        },
        {
          active: true,
          title: '재밌다',
        },
      ],
      ex11: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red darken-3', 'indigo darken-3', 'orange darken-3'],
      
    }),
}
</script>
