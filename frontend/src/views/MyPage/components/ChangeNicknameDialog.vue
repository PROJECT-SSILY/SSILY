<template>
  <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">닉네임 변경</div>
      <v-form
      ref="form"
      v-model="state.valid"
      lazy-validation
      @submit.prevent="checkNickname"
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
          <alert-dialog v-if="state.alert"/>
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
    </div>
  </div>
</template>
  
<script>
  import { useRouter } from 'vue-router'
  import { reactive, watch } from 'vue'
  import { useStore } from 'vuex'
  // import { computed } from 'vue'
  import AlertDialog from '../../AlertDialog.vue'

  export default {
    name: 'ChangeNicknameDialog',
    components: {
      AlertDialog
    },
    setup() {
      const router = useRouter()
      const store = useStore()  
      const state = reactive({
        dialog: false,
        valid: true,
        alert: false,
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
            state.alert = false
            await store.commit('accountStore/setAlertColor', 'error')
            await store.commit('accountStore/setAlertMessage', '닉네임 중복 확인이 필요합니다.')
            await store.commit('accountStore/setAlertIcon', 'alert')
            state.alert = true
            return
          } else {
              await store.dispatch('accountStore/changeNicknameAction', state.form.nickname.value)
              await router.go(0)
          }
      }
      const checkNickname = async function () {
          const result = await store.dispatch('accountStore/checkNicknameAction', state.form.nickname.value )
          if ( state.form.nickname.value.length == 0) {
              state.form.nickname.status = false
              state.alert = false
              await store.commit('accountStore/setAlertColor', 'error')
              await store.commit('accountStore/setAlertMessage', '닉네임을 입력해주세요.')
              await store.commit('accountStore/setAlertIcon', 'alert')
              state.alert = true
          } else if (result.data.data) {
              state.form.nickname.status = true
              state.alert = false
              await store.commit('accountStore/setAlertColor', 'success')
              await store.commit('accountStore/setAlertMessage', '사용 가능한 닉네임입니다.')
              await store.commit('accountStore/setAlertIcon', 'check')
              state.alert = true
          } else {
              state.form.nickname.status = false
              state.alert = false
              await store.commit('accountStore/setAlertColor', 'error')
              await store.commit('accountStore/setAlertMessage', '이미 사용중인 닉네임입니다.')
              await store.commit('accountStore/setAlertIcon', 'alert')
              state.alert = true
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
#nickname-btn {
    height:3rem;
    font-size: 1.5rem;
    opacity: 89%;
    border-radius:10px
  }

</style>