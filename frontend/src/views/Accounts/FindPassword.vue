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
      :rules="nameRules"
      label="Name"
      required
    ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
    </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          color="error"
          @click="sendPw"
        >
          비밀번호 찾기
        </v-btn>
      </v-col>
    </v-row>
    </v-container>
  </v-form>
</template>
  
<script>
 export default {
    data: () => ({
      valid: true,
      name: '',
      nameRules: [
        v => !!v || '이름 입력은 필수입니다.',
        v => (2 <= v && v.length <= 10) || '이름은 2자 이상 10자 이내로 작성해주세요.',
      ],
      email: '',
      emailRules: [
        v => !!v || '이메일 입력은 필수입니다.',
        v => /.+@.+\..+/.test(v) || '이메일이 유효하지 않습니다.',
      ],
    }),

    methods: {
      sendPw () {
        this.$refs.form.reset()
      },
    },
  }
</script>
