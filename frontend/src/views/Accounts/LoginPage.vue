<template>
  <v-form
  ref="loginForm"
  lazy-validation
  >
    <v-text-field
      v-model="email"
      type="email"
      label="이메일(아이디)"
    ></v-text-field>

    <v-text-field
      v-model="password"
      type="password"
      label="비밀번호"
    ></v-text-field>

    <v-btn
      color="success"
      class="mr-4"
      @click="ClickLogIn"
    >
      로그인
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="ClickSignUp"
    >
      회원가입
    </v-btn>

    <v-btn
      color="warning"
      class="mr-4"
      @click="ClickFindPw"
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
    }
  },
  methods: {
    ClickLogIn() {
      console.log('로그인 버튼 클릭')
      console.log("email=", this.email)
      console.log("password=", this.password)
    },
    ClickSignUp() {
      this.$router.push('signup')
    },
    ClickFindPw() {
      this.$router.push('findpw')
    }
  }
}
</script>

<style>

</style>