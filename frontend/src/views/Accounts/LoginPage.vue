<template>
  <v-form
  v-model="state.valid"
  ref="loginForm"
  lazy-validation
  >
    <v-text-field
      v-model="state.form.email"
      type="email"
      :rules="emailRules"
      label="이메일(아이디)"
    ></v-text-field>

    <v-text-field
      v-model="state.form.password"
      type="password"
      label="비밀번호"
    ></v-text-field>

    <v-btn
      class="mr-4"
      @click="clickLogIn"
    >
      로그인
    </v-btn>

    <v-btn
      class="mr-4"
      @click="clickSignUp"
    >
      회원가입
    </v-btn>

    <v-btn
      class="mr-4"
      @click="clickFindPw"
    >
      비밀번호 찾기
    </v-btn>
  </v-form>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
export default {
  name: 'LoginPage',
  setup() {
    const loginForm = ref(null)
    const state = reactive({
      form: {
        email: '',
        password: '',
      },
      valid: true,
    })
    const router = useRouter()
    function clickSignUp() {
      router.push({
        name: 'signup',
      })
    }
    function clickFindPw() {
      router.push({
        name: 'findpw',
      })
    }
    return {state, loginForm, clickSignUp, clickFindPw}
  },
  data() {
    return {
      emailRules: [
        v => !!v || '이메일을 입력해 주세요',
        v => /.+@.+\..+/.test(v) || '이메일이 유효하지 않습니다.',
      ],
    }
  },
}
</script>

<style>

</style>