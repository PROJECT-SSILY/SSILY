<template>
    <v-form
    ref="form"
    v-model="valid"
  >
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.emailRules]"
          label="이메일"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
        >
        이메일 중복 확인
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="name"
          :counter="10"
          :rules="[rules.required, rules.nameRules]"
          label="이름"
        ></v-text-field>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="nickname"
          :counter="10"
          :rules="[rules.required, rules.nicknameRules]"
          label="닉네임"
          ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
        >
        닉네임 중복 확인
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-text-field
            v-model="password1"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordRules]"
            name="password1"
            label="비밀번호"
            hint="At least 8 characters"
            @click:append="show1 = !show1"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
            v-model="password2"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordRules2]"
            name="password2"
            label="비밀번호 확인"
            hint="At least 8 characters"
            @click:append="show2 = !show2"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="!valid"
          @click="validate"
          class="mr-4"
        >
          회원가입 완료
        </v-btn>
    </v-col>
  </v-row>
  </v-container>
  </v-form>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            show1: false,
            show2: false,
            email: "",
            name: "",
            nickname: "",
            password1: "",
            password2: "",
            rules: {
              required: value => !!value || '필수',
              emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
              nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
              nicknameRules: value => (2 <= value.length && value.length <= 10) || '닉네임은 2자 이상 10자 이내로 작성해주세요',
              passwordRules: value => (8 <= value.length && value.length <= 16) || '비밀번호는 8자 이상 16자 이내로 작성해주세요',
              passwordRules2: value => (this.password1 == value) || '비밀번호가 일치하지 않습니다',
            },
        }
    },
    methods: {
      validate () {
        this.$refs.form.validate()
        if ( this.password1 != this.password2 ) {
          return false;
        }
      },
    }
}
</script>

<style>

</style>