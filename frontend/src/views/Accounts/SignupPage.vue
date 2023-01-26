<template>
    <v-form
    ref="form"
    lazy-validation
    v-model="state.valid"
  >
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-text-field
          v-model="state.form.email.value"
          ref="emailform"
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
          v-model="state.form.name"
          :rules="[rules.required, rules.nameRules]"
          label="이름"
        ></v-text-field>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="state.form.nickname.value"
          ref="nicknameform"
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
            v-model="state.form.password1"
            :append-icon="state.show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="state.show1 ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordRules]"
            name="password1"
            label="비밀번호"
            hint=""
            @click:append="state.show1 = !state.show1"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
            v-model="state.form.password2"
            :append-icon="state.show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="state.show2 ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordRules2]"
            name="password2"
            label="비밀번호 확인"
            hint=""
            @click:append="state.show2 = !state.show2"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="!state.valid"
          @click="clickSignup"
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
import { reactive, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SignupPage',
    data() {
      return {
        rules: {
          required: value => !!value || '필수',
          emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
          emailCheckRules: () => this.state.form.email.valid || '이메일 중복 확인이 필요합니다',
          nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
          nicknameRules: value => (2 <= value.length && value.length <= 10) || '닉네임은 2자 이상 10자 이내로 작성해주세요',
          nicknameCheckRules: () => this.state.form.nickname.valid || '닉네임 중복 확인이 필요합니다',
          passwordRules: value => (
            8 <= value.length && value.length <= 16 &&
            /^.*(?=^)(?=.*\d)(?=.*[a-zA-Z]).*$/.test(value)
            ) || '비밀번호는 문자와 숫자 조합(8 ~ 16자 이내)으로 작성해주세요',
          passwordRules2: value => ( this.state.form.password1 == value) || '비밀번호가 일치하지 않습니다',
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
        this.state.form.email.valid = true
        this.$refs.emailform.validate()
      },
      NicknameCheck () {
        this.state.form.nickname.valid = true
        this.$refs.nicknameform.validate()
      },
    },
    setup() {
      const state = reactive({
        form: {
          name: "",
          password1: "",
          password2: "",
          email: { value: "", valid: false },
          nickname: { value: "", valid: false },
        },
        valid: true,
        show1: false,
        show2: false,
      })

      const store = useStore()

      watch(() => state.form.email.value, (newValue, oldValue) => {
        state.form.email.valid = false
        console.log('변화 감지', {newValue, oldValue})
      })
      watch(() => state.form.nickname.value, (newValue, oldValue) => {
        state.form.nickname.valid = false
        console.log('변화 감지', {newValue, oldValue})
      })

      const clickSignup = async function () {
        const formData = {
          email: state.email,
          password: state.password1,
          nickname: state.nickname,
          name: state.name,
        }
        await store.dispatch('accountStore/registerAction', formData )
        await console.log("회원가입 완료")
      }

      return {
        state,
        clickSignup,
      }
    }

  }
</script>

<style>

</style>



