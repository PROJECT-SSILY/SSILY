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
import SettingDialog from '../../SettingDialog.vue';
import { reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfileBox',
  components: {
    SettingDialog,
  },
  setup() {
    const route = useRouter()
    const store = useStore()
    const state = reactive({
      nickname: null,
      robot: 0,
    })
    onBeforeMount(async ()=> {
          const token = await store.getters['accountStore/getToken']
          const res = await store.dispatch('accountStore/getMeAction', token)
          console.log(res)
          state.nickname = res.nickname
      })
    const toMyPage = function() {
      route.push('mypage')
    }
    const logOut = async function() {
            await store.dispatch('accountStore/logoutAction')
            route.push('/')
        }
    return {
      store,
      state,
      route,
      logOut,
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
