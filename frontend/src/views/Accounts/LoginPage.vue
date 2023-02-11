<template>
  <v-form
  ref="form"
  v-model="state.valid"
  lazy-validation
  @keyup.enter="enterLogIn"
  >
  <v-container class="formbox">
    <h1 class="title">회원 로그인</h1>
    <br>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.form.email"
          type="email"
          :rules="emailRules"
          label="이메일(아이디)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="state.form.password"
          type="password"
          label="비밀번호"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-btn
          block 
          class="mr-4"
          @click="clickLogIn"
        >
          로그인
        </v-btn>
      </v-col>
      <alert-dialog v-if="state.alert"/>
      <v-col cols="4">
        <v-btn
          block 
          class="mr-4"
          @click="clickSignUp"
        >
          회원가입
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          class="mr-4"
          @click="clickFindPw"
        >
          비밀번호 찾기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
    

    

    
  </v-form>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
import AlertDialog from '../AlertDialog.vue'

export default {
  name: 'LoginPage',
  components: {
    AlertDialog
  },  
  setup() {
    const store = useStore()
    const state = reactive({
      alert: false,
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
      if (response == 401) {
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '비밀번호가 일치하지 않습니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        router.go()
      } else if (response == 404) {
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '해당 회원을 찾을 수 없습니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
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

<style scoped>
.title {
  background: linear-gradient(rgba(12,111,202,1), rgba(38,0,111,1));
	background-clip: text;
	-webkit-background-clip: text;
  color: transparent;
}
.formbox {
  margin-top: 10%;
  background-color: rgb(255, 255, 255);
  width: 50%;
  border-radius: 20px;
  opacity: 85%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
</style>