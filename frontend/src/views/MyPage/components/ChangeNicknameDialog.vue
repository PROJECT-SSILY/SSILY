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
            닉네임 변경
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            닉네임 변경
          </v-card-title>
          <v-form
          ref="form"
          v-model="state.valid"
          lazy-validation
          >
              <div id="join-dialog" class="jumbotron vertical-center">
                <div class="form-group">
                  <v-text-field
                    class="form-control"  
                    v-model="state.form.nickname.value"
                    type="text"
                    label="변경할 닉네임을 입력하세요."   
                    ref="nicknameform"
                    :rules="[state.rules.required, state.rules.nicknameRules, state.rules.nicknameRules1]"
                    ></v-text-field>
                </div>
              </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <p class="text-center">
                <v-btn
                @click="checkNickname">
                중복 확인</v-btn>
                <v-btn
                :disabled="!state.valid"
                @click="changeNickname">변경</v-btn>
              </p>
            </v-card-actions>
        </v-form>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
    import { useRouter } from 'vue-router'
    import { reactive, watch } from 'vue'
    import { useStore } from 'vuex'
    // import { computed } from 'vue'

    export default {
      setup() {
        const router = useRouter()
        const store = useStore()  
        const state = reactive({
          dialog: false,
          valid: true,
          form: {
              nickname: { value: "", valid: true, status: false }
          },
          rules: {
            required: value => !!value || '필수',
            nicknameRules: value => (2 <= value.length && value.length <= 10) || '닉네임은 2자 이상 10자 이내로 작성해주세요',
          }
        })
        watch(() => state.form.nickname.value, (newValue, oldValue) => {
          state.form.nickname.status = false
          console.log('변화 감지', {newValue, oldValue})
        })
        const changeNickname = async function () {
            if (!state.form.nickname.status){
                alert("닉네임 중복확인이 필요합니다.")
                return
            } else {
                await store.dispatch('accountStore/changeNicknameAction', state.form.nickname.value)
                await router.go(0)
            }
        }
        const checkNickname = async function () {
            const result = await store.dispatch('accountStore/checkNicknameAction', state.form.nickname.value )
            if (result.data.data) {
                state.form.nickname.status = true
                alert("사용 가능한 닉네임입니다.")
            } else {
                state.form.nickname.status = false
                alert("이미 사용 중인 닉네임입니다.")
            }
            }
        return {
          router,
          store,
          state,
          changeNickname,
          checkNickname
        }
      
      }
    }
  </script>