<template>
  <div>
    <v-form
    ref="form"
    v-model="state.valid"
    lazy-validation
    >
      <v-container class="formbox">
        <h1 class="title">비밀번호 찾기</h1>
        <br>
        <v-row>
          <v-col cols="12">
            <v-text-field
            v-model="state.form.name"
            :counter="10"
            :rules="[state.rules.required, state.rules.nameRules]"
            label="Name"
            required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
            v-model="state.form.email.value"
            :rules="[state.rules.required, state.rules.emailRules]"
            label="E-mail"
            required
            ></v-text-field>
          </v-col>
        </v-row>
        <alert-dialog v-if="state.alert"/>
        <v-row>
          <v-col>
            <v-btn
            color="error"
            @click="sendNewPw"
            >
            비밀번호 찾기
              <v-progress-circular
                :size="20"
                indeterminate
                color="grey lighten-5"
                v-if="state.progress"
                class="spinner"
              ></v-progress-circular>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
  
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AlertDialog from '../AlertDialog.vue'

export default {
  name: 'FindPassword',
  components: {
    AlertDialog
  }, 
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      form: {
        name: "",
        email: {value: "", valid: true}
      },
      rules: {
        required: value => !!value || '필수',
        emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
        nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
      },
      valid: true,
      alert: false,
      progress: false,
    })

    const sendNewPw = async function () {
      state.progress = true
      const params = {
        email: state.form.email.value,
        name: state.form.name
      }
      const result = await store.dispatch('accountStore/sendAction', params )
      if (result == 0) {
        state.progress = false
        router.push('login')
      } else {
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '일치하는 사용자 정보가 없습니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
      }
    }
    return {
      state,
      sendNewPw,
    }
  }
}
</script>

<style scoped>
.title {
  background: linear-gradient(rgba(12,111,202,1), rgba(38,0,111,1));
	background-clip: text;
	-webkit-background-clip: text;
  color: transparent;
}
.formbox {
  margin-top: 10%;
  background-color: aliceblue;
  width: 50%;
  border-radius: 20px;
  opacity: 90%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
.spinner {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px
}
</style>