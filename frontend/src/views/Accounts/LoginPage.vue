<template>
  <v-form
  ref="loginForm"
  lazy-validation
  >
    <v-text-field
      v-model="email"
      :rules="emailRules"
      type="email"
      label="이메일(아이디)"
    ></v-text-field>

    <v-text-field
      v-model="password"
      type="password"
      label="비밀번호"
    ></v-text-field>

    <v-btn
      class="mr-4"
      color="success"
      @click="clickLogIn"
    >
      로그인
    </v-btn>

    <v-btn
      class="mr-4"
      color="success"
      @click="clickSignUp"
    >
      회원가입
    </v-btn>

    <v-btn
      class="mr-4"
      color="success"
      @click="clickFindPw"
    >
      비밀번호 찾기
    </v-btn>
  </v-form>

</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email : '',
      password: '',
      emailRules: [
        v => !!v || '이메일을 입력해 주세요',
        v => /.+@.+\..+/.test(v) || '이메일이 유효하지 않습니다.',
      ],
    }
  },
  methods: {
    clickLogIn() {
      console.log('dd')
    },
    clickSignUp() {
      this.$router.push('signup')
    },
    clickFindPw() {
      this.$router.push('findpw')
    }
  }
}
</script>

<style>

</style>