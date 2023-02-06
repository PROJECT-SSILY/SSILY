<template>
    <div class="text-center">
      <v-dialog
        v-model="state.dialog"
        width="500"
      >
        <template v-slot:activator="{ attrs }">
          <v-btn
            dark
            v-bind="attrs"
            @click.stop="state.dialog = true"
          >
            비밀번호 변경
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            비밀번호 변경
          </v-card-title>
          <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          >
              <div id="join-dialog" class="jumbotron vertical-center">
                <div class="form-group">
                  <v-text-field
                  v-model="state.password"
                  class="form-control"
                  label="변경할 비밀번호를 입력하세요."
                  type="text"
                  required></v-text-field>
                </div>
              </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <p class="text-center">
                <v-btn
                @click="changeNickname()">변경</v-btn>
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
    // import { computed } from 'vue'

    export default {
      setup() {
        const router = useRouter()
        const store = useStore()  
        const state = reactive({
          dialog: false,
          password : null,
          rules: {
            required: value => !!value || '필수',
          }
        })
        const changePassword = function () {
            store.dispatch('accountStore/setPassword', state.password)
        }
        return {
          router,
          store,
          state,
          changePassword
        }
      }
    }
  </script>