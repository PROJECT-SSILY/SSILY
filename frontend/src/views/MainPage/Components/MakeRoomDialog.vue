<template>
  <div class="wrap-dialog">
  <div class="dialog">
    <div class="tit-dialog">방 만들기</div>
    <v-form 
    ref="form" 
    lazy-validation
    v-model="state.valid" 
    @submit.prevent="joinSession">
        <div class="form-group">
          <v-text-field
            v-model="state.form.title"
            class="inp-txt form-control"
            label="방 제목"
            type="text"
            :rules="[state.rules.titleRules]"
            required
          ></v-text-field>
      </div>
      <!-- <v-radio-group v-model="state.isTeamBattle" inline>
        <v-radio label="팀전" color="orange darken-3" :value="true"></v-radio>
        <v-radio
          label="개인전"
          color="orange darken-3"
          :value="false"
        ></v-radio>
      </v-radio-group> -->
      <v-radio-group v-model="state.form.isSecret" inline>
        <v-radio label="공개" color="orange darken-3" :value="false"></v-radio>
        <v-radio label="비공개" color="orange darken-3" :value="true"></v-radio>
      </v-radio-group>
      <v-text-field
        v-if="state.form.isSecret == true"
        label="비밀번호 숫자 4자리를 입력하세요."
        hide-details="auto"
        type="password"
        maxlength="4"
        v-model="state.form.password.value"
        :rules="[state.rules.passwordRules]"
      ></v-text-field>
      <alert-dialog v-if="state.alert"/>
      <v-btn
      type="submit" 
      class="btn-dialog">완료</v-btn>
    </v-form>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
// import { watch } from "vue";
import { useStore } from "vuex";
import $axios from "axios";
import AlertDialog from '../../AlertDialog.vue'

$axios.defaults.headers.post["Content-Type"] = "application/json";

export default {
  components: {
    AlertDialog
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      form: {
        title: null,
        isSecret: false,
        password:{ value: "", valid: true, status: false },
        isTeamBattle: false,
        valid: false,
        alert:false,
      },
      rules: {
      // required: value => !!value || '필수',
        titleRules: (value) => (1 <= value.length && value.length <= 20) || "방제목은 20자 이내로 작성해주세요!"
        ,
        passwordRules: (value) => {
          if(state.form.isSecret){
            (/^\d{4}$/.test(value)) || '비밀번호는 4자리 숫자여야 합니다!'
          }
        },
      }
    });
    onMounted(() => {
      // 방 타이틀 랜덤 생성
      const titlelist = [
        "함께 즐겨요",
        "재미있는 게임 합시다",
        "매너있는 게임하실 분 구해요!",
        "스겜합시다!",
        "어서 들어오세요!",
      ];
      state.form.title = titlelist[Math.floor(Math.random() * titlelist.length)];
    });

    const joinSession = async function () {
      if (state.form.isSecret && !(/^\d{4}$/.test(state.form.password.value))) {
      
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '비밀번호는 4자리 숫자여야 합니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      } else if (1 > state.form.title.length || state.form.title.length > 20) {
        state.alert = false
        await store.commit('accountStore/setAlertColor', 'error')
        await store.commit('accountStore/setAlertMessage', '방 제목은 20자 이내여야 합니다.')
        await store.commit('accountStore/setAlertIcon', 'alert')
        state.alert = true
        return
      } else {
        store.commit("gameStore/setTitle", state.form.title);
        store.commit("gameStore/setSecret", state.form.isSecret);
        store.commit("gameStore/setPassword", state.form.password.value);
        store.commit("gameStore/setTeam", state.form.isTeamBattle);
        // 세션을 먼저 만든 후 세션ID를 발급받아 해당 URL로 이동
        const sessionId = await store.dispatch("gameStore/createSession");
        console.log("sessionId : ", sessionId);
        router.push({ name: "gameroom", params: { sessionId: sessionId } });
      }
    };
    return {
      router,
      state,
      joinSession,
    };
  },
};
</script>

<style scoped>
.dialog {
  height: 100%;
  max-height: 500px;
  width: 500px;
}
.btn-dialog {
  background: #24CB83;
  color: #FFFFFF;
}











/* ================ */
/* .tutorial-planet {
  font-family: "Akronim", cursive;
  font-size: 2rem;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transform: translate(-9px, -15px);
}
@keyframes shake-tutorial-planet {
  0% {
    transform: translate(-8px, -14px);
  }
  33% {
    transform: translate(-10px, -14px);
  }
  66% {
    transform: translate(-10px, -16px);
  }
  100% {
    transform: translate(-8px, -16px);
  }
}

.tutorial-planet:hover {
  animation: shake-tutorial-planet 0.1s infinite alternate;
}

.formbox {
  padding: 2rem;
  margin-top: 10%;
  width: 100%;
  border-radius: 20px;
  opacity: 100%;
  font-family: "MaplestoryOTFBold";
  font-weight: normal;
  font-style: normal;
} */
</style>