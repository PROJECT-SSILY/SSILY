<template>
    <div>
      <v-container>
        <v-row>
          <v-col col="9" id="proleft">
            <v-row>
              <v-col>
                <h3 class="welcome">
                  어서오세요, {{state.nickname}}님!
                </h3>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between mb-6">
              <v-col col="2"  class="btnbox">
                <v-btn 
                rounded
                color="success" 
                @click="toMyPage">
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </v-col>
            <v-col col="2"  class="btnbox">
              <v-btn rounded color="warning" @click="logOut">
                <v-icon>mdi-logout-variant</v-icon>
              </v-btn>
            </v-col>
            <v-col col="2" class="btnbox">
              <SettingDialog></SettingDialog>
            </v-col>
            </v-row>
            </v-col>
          <v-col col="2">
            <v-img @click="toMyPage" :src="state.robot"></v-img>
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
          state.nickname = res.nickname
          if (res.level > -1 && res.level < 6)  {
                state.robot = "./robotface1.svg"
            } else if (res.level > 5 && res.level < 11) {
                state.robot = "./robotface2.svg"
            } else {
                state.robot = "./robotface3.svg"
          }
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
.btnbox {
  display: flex;
}
.welcome {
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
</style>
