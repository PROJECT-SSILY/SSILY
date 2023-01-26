<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
  <v-container>
    <v-row>
      <v-col cols="12">
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="[state.rules.required, state.rules.nameRules]"
      label="Name"
      required
    ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
    <v-text-field
      v-model="email"
      :rules="[state.rules.required, state.rules.emailRules]"
      label="E-mail"
      required
    ></v-text-field>
    </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          color="error"
          @click="checkEmail"
        >
          비밀번호 찾기
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
  name: 'FindPassword',
  setup() {
    const store = useStore()
    const state = reactive({
      form: {
        name: "",
        email: {value: "", valid: true, status: false}
      },
      rules: {
        required: value => !!value || '필수',
        emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
        emailCheckRules: () => state.form.email.valid || '이미 사용 중인 이메일입니다.',
        nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
      },
      valid: true,
    })

    watch(() => state.form.email.value, (newValue, oldValue) => {
      state.form.email.status = false
      console.log('변화 감지', {newValue, oldValue})
    })
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
    return {
      state,
      checkEmail,
    }
  }
}
</script>
