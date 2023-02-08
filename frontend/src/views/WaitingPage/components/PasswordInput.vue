<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }
      ">
        <v-btn
          dark
          v-bind="attrs"
          @click.stop="state.dialog = true"
        >
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          비밀번호 입력
        </v-card-title>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        >
          <div id="join" v-if="!state.session">
            <div id="join-dialog" class="jumbotron vertical-center">

            </div>
          </div>
          <v-text-field 
            label="비밀번호 숫자 4자리를 입력하세요."
            hide-details="auto"
            v-model="state.password"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p class="text-center">
              <v-btn 
              @click="joinSession()">Join!</v-btn>
            </p>
          </v-card-actions>
      </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import { reactive } from 'vue'
  import { useStore } from 'vuex'
  import $axios from "axios";

  $axios.defaults.headers.post['Content-Type'] = 'application/json';

 
  export default {
    name: 'PasswordInput',
    props: {
      dialog: Object
    },
    setup() {
      const router = useRouter()
      const store = useStore()      
      const state = reactive({
        password: null
      })
      const joinSession = async function() {
        if (state.password === store.state.gameStore.password) {
          router.push('gameroom')
        } else {
          state.dialog = false
        }
      }
      return {
        router, 
        state,
        joinSession
      }
    }
  }
</script>