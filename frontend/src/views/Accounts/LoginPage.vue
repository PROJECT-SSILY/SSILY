<template>
  <v-form
  ref="form"
  v-model="state.valid"
  lazy-validation
  @keyup.enter="enterLogIn"
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
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
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
    const clickLogIn = async function () {
      const formData = {
        email: state.form.email,
        password: state.form.password
      }
      const response = await store.dispatch('accountStore/loginAction', formData)
      if (response == -100 ) {
        console.log('로그인 실패!!') 
        router.go()
      } else {
        console.log('로그인 성공!!')
        router.push({
          name: 'main'
        })
      }
    }
    const enterLogIn = async function () {
      console.log('엔터 실행')
      const formData = {
        email: state.form.email,
        password: state.form.password
      }
      const response = await store.dispatch('accountStore/loginAction', formData)
      if (response == -100 ) {
        console.log('로그인 실패!!') 
        router.go()
      } else {
        console.log('로그인 성공!!')
        router.push({
          name: 'main'
        })
      }
    }
    return {state, store, onMounted, clickSignUp, clickFindPw, clickLogIn, enterLogIn}
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