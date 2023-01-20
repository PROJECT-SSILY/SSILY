<template>
  <v-form
  ref="form"
  v-model="valid"
  lazy-validation
  >
    <v-text-field
      v-model="email"
      :counter="10"
      :rules="emailRules"
      label="이메일(아이디)"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="비밀번호"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      로그인
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      회원가입
    </v-btn>

    <v-btn
      color="warning"
      @click="resetValidation"
    >
      비밀번호 찾기
    </v-btn>
  </v-form>

</template>

<script>
export default {
  name: 'LoginPage',
  setup() {
    const email = '';
    const password = '';
    return {
      email,
      password
    }
  }
}
</script>

<style>

</style>