<template>
  <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">비밀번호 찾기</div>
      <v-form ref="form" v-model="state.valid" lazy-validation @submit.prevent="onSubmit">
        <v-text-field
          v-model="state.form.name"
          :counter="10"
          :rules="[state.rules.required, state.rules.nameRules]"
          label="Name"
          variant="underlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="state.form.email.value"
          :rules="[state.rules.required, state.rules.emailRules]"
          label="E-mail"
          variant="underlined"
          required
        ></v-text-field>
        <alert-dialog v-if="state.alert" />
        <button type="submit" class="btn-dialog" @click="sendNewPw">
          비밀번호 찾기 <v-progress-circular
          v-if="state.progress"
          indeterminate
          color="deep-orange-lighten-2"
        ></v-progress-circular>
        </button>
      </v-form>
    </div>
  </div>
  <div class="background">
    <div id="stars" class="rotating"></div>
  </div>
</template>
  
<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AlertDialog from "../AlertDialog.vue";

export default {
  name: "FindPassword",
  components: {
    AlertDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      form: {
        name: "",
        email: { value: "", valid: true },
      },
      rules: {
        required: (value) => !!value || "필수",
        emailRules: (value) =>
          /.+@.+\..+/.test(value) || "이메일이 유효하지 않습니다",
        nameRules: (value) =>
          (2 <= value.length && value.length <= 10) ||
          "이름은 2자 이상 10자 이내로 작성해주세요",
      },
      valid: true,
      alert: false,
      progress: false,
    });

    const sendNewPw = async function () {
      state.progress = true;
      const params = {
        email: state.form.email.value,
        name: state.form.name,
      };
      const result = await store.dispatch("accountStore/sendAction", params);
      if (result == 0) {
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "success");
        await store.commit(
          "accountStore/setAlertMessage",
          "임시 비밀번호를 전송했습니다."
        );
        await store.commit("accountStore/setAlertIcon", "check");
        state.progress = false;
        state.alert = true;
        setTimeout(() => {
          router.push("login")
        }, 2000
        )
        
      } else {
        state.progress = false
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "일치하는 사용자 정보가 없습니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
      }
    };
    return {
      state,
      sendNewPw,
    };
  },
};
</script>

<style scoped>
.btn-dialog {
  background: #FF6060;
  color: white;
}
</style>