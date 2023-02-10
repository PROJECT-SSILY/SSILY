<template>
    <div class="text-center">
      <v-dialog
        v-model="state.dialog"
        width="500"
      >
        <template v-slot:activator="{ attrs }">
          <v-btn
            block
            x-large
            dark
            v-bind="attrs"
            @click.stop="state.dialog = true"
          >
            비밀번호 변경
          </v-btn>
        </template>
        <v-card class="formbox">
          <v-card-title>
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
              <alert-dialog v-if="state.alert"/>
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
    import AlertDialog from '../../AlertDialog.vue'

    export default {
      name: 'ChangePasswordDialog',
      components: {
        AlertDialog
      },    
      setup() {
        const router = useRouter()
        const store = useStore()  
        const state = reactive({
          alert: false,
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
          const formData = {
            "oldPassword": state.form.oldpassword,
            "newPassword" : state.form.password1
          }
          const response = await store.dispatch('accountStore/changePasswordAction', formData)
          
            
          console.log(response);
          if (state.form.oldpassword == state.form.password1) {
            state.alert = false
            await store.commit('accountStore/setAlertColor', 'error')
            await store.commit('accountStore/setAlertMessage', '기존 비밀번호는 바꿀 비밀번호와 달라야 합니다!')
            await store.commit('accountStore/setAlertIcon', 'alert')
            state.alert = true
            return
          }
          else if (response == -104) {
            state.alert = false
            await store.commit('accountStore/setAlertColor', 'error')
            await store.commit('accountStore/setAlertMessage', '기존 비밀번호를 정확히 입력해 주세요!')
            await store.commit('accountStore/setAlertIcon', 'alert')
            state.alert = true
            return
          } else if 
          (response == 0) {
            state.alert = false
            await store.commit('accountStore/setAlertColor', 'success')
            await store.commit('accountStore/setAlertMessage', '비밀번호 변경 성공!')
            await store.commit('accountStore/setAlertIcon', 'check')
            state.alert = true
            router.go(0)
          } else {
            state.alert = false
            await store.commit('accountStore/setAlertColor', 'error')
            await store.commit('accountStore/setAlertMessage', '잘못된 접근입니다.')
            await store.commit('accountStore/setAlertIcon', 'alert')
            state.alert = true
            return
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

  <style scoped>
  .formbox {
    padding: 2rem;
    margin-top: 10%;
    width: 100%;
    border-radius: 20px;
    opacity: 100%;
    font-family: 'MaplestoryOTFBold';
    font-weight: normal;
    font-style: normal;
  }
  </style>