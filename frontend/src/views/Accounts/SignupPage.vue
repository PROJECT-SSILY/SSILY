<template>
  <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">회원가입</div>
      <v-form ref="form" lazy-validation v-model="state.valid" @submit.prevent="clickSignup">
        <v-text-field
          v-model="state.form.email.value"
          ref="emailform"
          :rules="[
            state.rules.required,
            state.rules.emailRules,
            state.rules.emailCheckRules,
          ]"
          label="이메일"
          variant="underlined"
          @keyup.enter="checkEmail"
        >
          <template v-slot:append-inner>
            <v-btn variant="text" @click="checkEmail">중복 확인</v-btn>
          </template>
        </v-text-field>
        <v-text-field
          v-model="state.form.name"
          variant="underlined"
          :rules="[state.rules.required, state.rules.nameRules]"
          label="이름"
        ></v-text-field>
        <v-text-field
          v-model="state.form.nickname.value"
          variant="underlined"
          ref="nicknameform"
          :rules="[state.rules.required,state.rules.nicknameRules,state.rules.nicknameCheckRules,]"
          label="닉네임"
          @keyup.enter="checkNickname"
        >
          <template v-slot:append-inner>
            <v-fade-transition leave-absolute>
              <v-btn variant="text" @click="checkNickname">중복 확인</v-btn>
            </v-fade-transition>
          </template>
        </v-text-field>
        <v-text-field
          v-model="state.form.password1"
          :append-icon="state.show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="state.show1 ? 'text' : 'password'"
          :rules="[state.rules.required, state.rules.passwordRules]"
          variant="underlined"
          name="password1"
          label="비밀번호"
          hint=""
          @click:append="state.show1 = !state.show1"
        ></v-text-field>
        <v-text-field
          v-model="state.form.password2"
          :append-icon="state.show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="state.show2 ? 'text' : 'password'"
          :rules="[state.rules.required, state.rules.passwordRules2]"
          variant="underlined"
          name="password2"
          label="비밀번호 확인"
          hint=""
          @click:append="state.show2 = !state.show2"
          @keyup.enter="clickSignup"
        ></v-text-field>
        <button
          type="submit"
          class="btn-dialog"
          :disabled="!state.valid"
        >
          회원가입 완료
        </button>
      </v-form>
      <alert-dialog v-if="state.alert" />
    </div>
  </div>
  <div class="background">
    <div id="stars" class="rotating"></div>
  </div>
</template>
<script>
import { reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AlertDialog from "../AlertDialog.vue";


export default {
  name: "SignupPage",
  components: {
    AlertDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      form: {
        name: "",
        password1: "",
        password2: "",
        email: { value: "", valid: true, status: false },
        nickname: { value: "", valid: true, status: false },
      },
      alert: false,
      rules: {
        required: (value) => !!value || "필수",
        emailRules: (value) => /.+@.+\..+/.test(value) || "이메일이 유효하지 않습니다",
        emailCheckRules: () => state.form.email.valid || "이미 사용 중인 이메일입니다.",
        nameRules: (value) => (2 <= value.length && value.length <= 10) || "이름은 2자 이상 10자 이내로 작성해주세요",
        nicknameRules: (value) => (2 <= value.length && value.length <= 10) || "닉네임은 2자 이상 10자 이내로 작성해주세요",
        nicknameRules1: () => state.form.nickname.valid || "이미 사용 중인 닉네임입니다.",
        passwordRules: (value) => /^.*(?=^)(?=.*\d)(?=.*[a-zA-Z]){8,16}.*$/.test(value) || "비밀번호는 문자와 숫자 조합(8 ~ 16자 이내)으로 작성해주세요",
        passwordRules2: (value) => state.form.password1 == value || "비밀번호가 일치하지 않습니다",
      },
      valid: true,
      show1: false,
      show2: false,
    });

    watch(() => state.form.email.value, (newValue, oldValue) => {
        state.form.email.status = false;
        console.log("변화 감지", { newValue, oldValue });
      }
    );
    watch(() => state.form.nickname.value, (newValue, oldValue) => {
        state.form.nickname.status = false;
        console.log("변화 감지", { newValue, oldValue });
      }
    );

    const clickSignup = async function () {
      if (!state.form.email.status) {
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "이메일 중복 확인이 필요합니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
        return;
      } else if (!state.form.nickname.status) {
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "닉네임 중복 확인이 필요합니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
        return;
      } else {
        const formData = {
          email: state.form.email.value,
          password: state.form.password1,
          nickname: state.form.nickname.value,
          name: state.form.name,
        };
        await store.dispatch('accountStore/registerAction', formData )
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "success");
        await store.commit(
          "accountStore/setAlertMessage",
          "회원 가입 완료!"
        );
        await store.commit("accountStore/setAlertIcon", "check");
        state.alert = true;
        state.alert = true;
        setTimeout(() => {
          router.push("login")
        }, 2000
        )
      }
    };

    const checkEmail = async function () {
      const result = await store.dispatch("accountStore/checkEmailAction", state.form.email.value);
      if (result.data.data) {
        state.form.email.status = true;
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "success");
        await store.commit(
          "accountStore/setAlertMessage",
          "사용 가능한 이메일입니다."
        );
        await store.commit("accountStore/setAlertIcon", "check");
        state.alert = true;
      } else {
        state.form.email.status = false;
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "이미 사용 중인 이메일입니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
      }
    };

    const checkNickname = async function () {
      const nickname = state.form.nickname.value
      const result = await store.dispatch("accountStore/checkNicknameAction", nickname);
      if (2 > nickname.length || nickname.length > 10) {
        state.form.nickname.status = false;
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "닉네임은 2자 이상 10자 이내로 작성해주세요."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
      } else if (result.data.data) {
        state.form.nickname.status = true;
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "success");
        await store.commit(
          "accountStore/setAlertMessage",
          "사용 가능한 닉네임입니다."
        );
        await store.commit("accountStore/setAlertIcon", "check");
        state.alert = true;
      } else {
        state.form.nickname.status = false;
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "이미 사용 중인 닉네임입니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
      }
    };

    return {
      state,
      clickSignup,
      checkEmail,
      checkNickname,
    };
  },
};
</script>

<style scoped>
.btn-dialog {
  background: #24cb83;
  color: white;
}
.btn-dialog:disabled {
  background: #838383;
  color: white;
}
</style>
