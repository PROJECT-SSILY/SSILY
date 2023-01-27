<template>
  <v-form
    ref="form"
    v-model="state.valid"
    lazy-validation
  >
  <v-container>
    <v-row>
      <v-col cols="12">
    <v-text-field
      v-model="state.form.name"
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
      v-model="state.form.email.value"
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
          @click="sendNewPw"
        >
          비밀번호 찾기
        </v-btn>
      </v-col>
    </v-row>
    </v-container>
  </v-form>
</template>
  
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'


export default {
  name: 'FindPassword',
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      form: {
        name: "",
        email: {value: "", valid: true}
      },
      rules: {
        required: value => !!value || '필수',
        emailRules: value => /.+@.+\..+/.test(value) || '이메일이 유효하지 않습니다',
        nameRules: value => (2 <= value.length && value.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요',
      },
      valid: true,
    })
    const sendNewPw = async function () {
      const params = {
        email: state.form.email.value,
        name: state.form.name
      }
      const result = await store.dispatch('accountStore/sendAction', params )
      if (result == 0) {
        alert("성공")
        router.push('login')
      } else {
        alert("실패")
      }
    }
    return {
      state,
      sendNewPw,
    }
  }
}
</script>
