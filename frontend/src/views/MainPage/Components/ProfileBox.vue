<template>
    <div>
      <v-container>
        <v-row>
          <v-col col="9" id="proleft">
            <v-row>
              <v-col>어서오세요, {{state.nickname}}님!</v-col>
            </v-row>
            <v-row justify="center">
              <v-col id="btnbox">
                <v-btn>Setting</v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col col="2">
            <v-avatar size="64">
              <v-img @click="toMyPage" src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
            </v-avatar>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
<script>
import { reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfileBox',
  setup() {
    const route = useRouter()
    const store = useStore()
    const state = reactive({
      nickname: null
    })
    onBeforeMount(async ()=> {
          const token = store.getters['accountStore/getToken']
          const res = await store.dispatch('accountStore/getMeAction', token)
          state.nickname = res.nickname
      })
    const toMyPage = function() {
      route.push('mypage')
    }
    return {
      store, 
      state,
      route,
      toMyPage
      }
  }
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
