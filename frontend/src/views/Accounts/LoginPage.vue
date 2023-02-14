<template>
  <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">로그인</div>
      <v-form
        ref="form"
        v-model="state.valid"
        lazy-validation
      >
        <v-text-field
          v-model="state.form.email"
          type="email"
          :rules="emailRules"
          label="이메일(아이디)"
          variant="underlined"
        />
        <v-text-field
          v-model="state.form.password"
          type="password"
          label="비밀번호"
          variant="underlined"
        />
      </v-form>
      <button type="submit" class="btn-dialog" @click="clickLogIn">로그인</button>
      <div class="wrap-btn">
        <router-link to="/signup">회원가입</router-link>
        <router-link to="/findpw">비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
  <div class="background">
    <div id="stars" class="rotating"></div>
  </div>
  <alert-dialog v-if="state.alert" />
</template>

<script>
import { reactive } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
import AlertDialog from "../AlertDialog.vue";

export default {
  name: "LoginPage",
  components: {
    AlertDialog,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      alert: false,
      form: {
        email: "",
        password: "",
      },
      valid: true,
    });
    const router = useRouter();
    function clickSignUp() {
      router.push({
        name: "signup",
      });
    }
    function clickFindPw() {
      router.push({
        name: "findpw",
      });
    }
    const clickLogIn = async function () {
      const formData = {
        email: state.form.email,
        password: state.form.password,
      };
      const response = await store.dispatch(
        "accountStore/loginAction",
        formData
        );
      if (response == 401) {
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "비밀번호가 일치하지 않습니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
        router.go();
      } else if (response == 404) {
        state.alert = false;
        await store.commit("accountStore/setAlertColor", "error");
        await store.commit(
          "accountStore/setAlertMessage",
          "해당 회원을 찾을 수 없습니다."
        );
        await store.commit("accountStore/setAlertIcon", "alert");
        state.alert = true;
      } else {
        console.log("로그인 성공!!");
        router.push({
          name: "main",
        });
      }
    };
    return {
      state,
      store,
      onMounted,
      clickSignUp,
      clickFindPw,
      clickLogIn,
    };
  },
  data() {
    return {
      emailRules: [
        (v) => !!v || "이메일을 입력해 주세요",
        (v) => /.+@.+\..+/.test(v) || "이메일이 유효하지 않습니다.",
      ],
    };
  },
};
</script>

<style scoped>
.dialog {
  width: 100%;
}
.btn-dialog {
  background: #24CB83;
  color: white;
}
.wrap-btn {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6e6e6e;
}

</style>