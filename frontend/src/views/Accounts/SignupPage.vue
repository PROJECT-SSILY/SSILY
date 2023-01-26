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
          :rules="[state.rules.required, state.rules.emailRules, state.rules.emailCheckRules ]"
          label="이메일"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
          @click="checkEmail"
        >
        이메일 중복 확인
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="state.form.name"
          :rules="[state.rules.required, state.rules.nameRules]"
          label="이름"
        ></v-text-field>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="state.form.nickname.value"
          ref="nicknameform"
          :rules="[state.rules.required, state.rules.nicknameRules, state.rules.nicknameCheckRules]"
          label="닉네임"
          ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
          class="mr-4"
          @click="checkNickname"
        >
        닉네임 중복 확인
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-text-field
            v-model="state.form.password1"
            :append-icon="state.show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="state.show1 ? 'text' : 'password'"
            :rules="[state.rules.required, state.rules.passwordRules]"
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
            :rules="[state.rules.required, state.rules.passwordRules2]"
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
  setup() {
    const store = useStore()
    const state = reactive({
      form: {
        name: "",
        password1: "",
        password2: "",
        email: { value: "", valid: true, status: false },
        nickname: { value: "", valid: true, status: false },
      },
      rules: {
        required: value => !!value || '필수',
        emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
        emailCheckRules: () => state.form.email.valid || '이미 사용 중인 이메일입니다.',
        nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
        nicknameRules: value => (2 <= value.length && value.length <= 10) || '닉네임은 2자 이상 10자 이내로 작성해주세요',
        nicknameRules1: () => state.form.nickname.valid || '이미 사용 중인 닉네임입니다.',
        passwordRules: value => (
          /^.*(?=^)(?=.*\d)(?=.*[a-zA-Z]){8,16}.*$/.test(value)
          ) || '비밀번호는 문자와 숫자 조합(8 ~ 16자 이내)으로 작성해주세요',
        passwordRules2: value => ( state.form.password1 == value) || '비밀번호가 일치하지 않습니다',
      },
      valid: true,
      show1: false,
      show2: false,
    })

    watch(() => state.form.email.value, (newValue, oldValue) => {
      state.form.email.status = false
      console.log('변화 감지', {newValue, oldValue})
    })
    watch(() => state.form.nickname.value, (newValue, oldValue) => {
      state.form.nickname.status = false
      console.log('변화 감지', {newValue, oldValue})
    })

    const clickSignup = async function () {
      if (!state.form.email.status){
        alert("이메일 중복확인이 필요합니다.")
        return
      } else if (!state.form.nickname.status){
        alert("닉네임 중복확인이 필요합니다.")
        return
      } else {
        const formData = {
          email: state.form.email.value,
          password: state.form.password1,
          nickname: state.form.nickname.value,
          name: state.form.name,
        }
        await store.dispatch('accountStore/registerAction', formData )
        await console.log("회원가입 완료")
      } 
    }

    const checkEmail = async function () {
      const result = await store.dispatch('accountStore/checkEmailAction', state.form.email.value )
      if (result.data.data) {
        state.form.email.status = true
        alert("사용 가능한 이메일입니다.")
      } else {
        state.form.email.status = false
        alert("이미 사용 중인 이메일입니다.")
      }
    }

    const checkNickname = async function () {
      console.log(state.form.nickname.status)
      const result = await store.dispatch('accountStore/checkNicknameAction', state.form.nickname.value )
      if (result.data.data) {
        state.form.nickname.status = true
        alert("사용 가능한 닉네임입니다.")
      } else {
        state.form.nickname.status = false
        alert("이미 사용 중인 닉네임입니다.")
      }
    }

    return {
      state,
      clickSignup,
      checkEmail,
      checkNickname,
    }
  }
}
</script>

<style>

</style>



