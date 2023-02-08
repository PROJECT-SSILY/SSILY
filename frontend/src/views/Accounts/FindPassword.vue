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
        <v-row>
          <v-col>
            <v-btn
            color="error"
            @click="sendNewPw"
            >
            비밀번호 찾기
            <!-- <Jawn v-if="state.isLoading"></Jawn> -->
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
// import {Jawn} from 'vue-loading-spinner'

export default {
  name: 'FindPassword',
  components: {
    // Jawn
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
      // isLoading: false,
      overlay: false
    })

    const sendNewPw = async function () {
      state.overlay = !state.overlay
      // state.isLoading = true
      const params = {
        email: state.form.email.value,
        name: state.form.name
      }
      const result = await store.dispatch('accountStore/sendAction', params )
      
      if (result == 0) {
        // state.isLoading = false
        alert("임시 비밀번호 전송 완료!")
        router.push('login')
      } else {
        // state.isLoading = false
        state.overlay = !state.overlay
        alert("실패")
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
</style>