<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }">
        <v-btn
          block
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
        v-model="state.valid"
        lazy-validation
        >
            <div id="join-dialog" class="jumbotron vertical-center">
              <div class="form-group">
                <v-col cols="12">
                  <v-text-field
                    v-model="state.form.oldpassword"
                    :append-icon="state.show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="state.show ? 'text' : 'password'"
                    name="oldpassword"
                    label="기존 비밀번호"
                    hint=""
                    @click:append="state.show = !state.show"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="state.form.password1"
                    :append-icon="state.show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="state.show1 ? 'text' : 'password'"
                    :rules="[state.rules.required, state.rules.passwordRules]"
                    name="password1"
                    label="변경할 비밀번호"
                    hint=""
                    @click:append="state.show1 = !state.show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-model="state.form.password2"
                      :append-icon="state.show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="state.show2 ? 'text' : 'password'"
                      :rules="[state.rules.required, state.rules.passwordRules2]"
                      name="password2"
                      label="비밀번호 확인"
                      hint=""
                      @click:append="state.show2 = !state.show2"
                  ></v-text-field>
                </v-col>
              </div>
            </div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p class="text-center">
              <v-btn
              @click="changePassword()">변경</v-btn>
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
          valid: false,
          form:{
            oldpassword:"",
            password1: "",
            password2: "",
          },
          show: false,
          show1: false,
          show2: false,
          rules: {
            required: value => !!value || '필수',
            passwordRules: value => (
              /^.*(?=^)(?=.*\d)(?=.*[a-zA-Z]){8,16}.*$/.test(value)
              ) || '비밀번호는 문자와 숫자 조합(8 ~ 16자 이내)으로 작성해주세요',
            passwordRules2: value => ( state.form.password1 == value) || '비밀번호가 일치하지 않습니다',
          },
        })
        const changePassword = async function () {
          if (state.form.oldpassword == state.form.password1) {
            alert('변경할 비밀번호는 기존 비밀번호와 달라야 합니다!')
            return
          } else {
            const formdata = {
              "oldPassword": state.form.oldpassword,
              "newPassword" : state.form.password1
            }
            await store.dispatch('accountStore/changePasswordAction', formdata)
            router.go(0)
          }
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