<template>
    <v-form
    ref="form"
    lazy-validation
    v-model="valid"
  >
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-text-field
          v-model="email.value"
          ref="emailform"
          lazy-validation
          :rules="[rules.required, rules.emailRules, rules.emailCheckRules ]"
          label="이메일"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
          @click="EmailCheck"
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
          v-model="nickname.value"
          :counter="10"
          :rules="[rules.required, rules.nicknameRules, rules.nicknameCheckRules]"
          label="닉네임"
          ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
          @click="NicknameCheck"
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
            hint=""
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
            hint=""
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
import axios from 'axios'
import { reactive, watch } from 'vue'

export default {
  name: 'SignupPage',
    data() {
      return {
          valid: true,
          show1: false,
          show2: false,
          name: "",
          password1: "",
          password2: "",
          rules: {
            required: value => !!value || '필수',
            emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
            emailCheckRules: () => this.email.valid || '이메일 중복 확인이 필요합니다',
            nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
            nicknameRules: value => (2 <= value.length && value.length <= 10) || '닉네임은 2자 이상 10자 이내로 작성해주세요',
            nicknameCheckRules: () => this.nickname.valid || '닉네임 중복 확인이 필요합니다',
            passwordRules: value => (
              8 <= value.length && value.length <= 16 && 
              /^.*(?=^)(?=.*\d)(?=.*[a-zA-Z]).*$/.test(value)
              ) || '비밀번호는 문자와 숫자 조합(8 ~ 16자 이내)으로 작성해주세요',
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
      EmailCheck () {
        this.email.valid = true
        this.$refs.emailform.resetValidation()
        console.log("emailcheck")
      },
      NicknameCheck () {
        this.nickname.valid = true
        console.log("nicknamecheck")
      },
      SignUp () {
        axios({
          method: 'post',
          url: `${this.state.API_URL}/api/member`,
          data: {
            email: this.email,
            name: this.name,
            nickname: this.nickname,
            password1: this.password1,
          }
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
    setup() {
      const email = reactive({ value: "", valid: false })
      const nickname = reactive({ value: "", valid: false })

      watch(() => email.value, (newValue, oldValue) => {
        email.valid = false
        console.log('변화 감지', {newValue, oldValue})
      })
      watch(() => nickname.value, (newValue, oldValue) => {
        nickname.valid = false
        console.log('변화 감지', {newValue, oldValue})
      })

      return {
        email,
        nickname,
      }
    }
  }
</script>

<style>

</style>



