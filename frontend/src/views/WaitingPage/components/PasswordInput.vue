<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      hide-overlay
      transition="dialog-bottom-transition"
    >      
      <v-card class="formbox">
        <v-card-title>
          비밀번호 입력
        </v-card-title>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        >
          <v-text-field 
            label="비밀번호 숫자 4자리를 입력하세요."
            hide-details="auto"
            v-model="state.input"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <p class="text-center">
              <v-btn 
              @click="checkPassword">참가하기</v-btn>
            </p>
            <alert-dialog v-if="state.alert"/>
          </v-card-actions>
      </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import { reactive } from 'vue'
  import { useStore } from 'vuex'
  import $axios from "axios";
  import AlertDialog from '../../AlertDialog.vue'
  import { ref } from '@vue/reactivity'

  $axios.defaults.headers.post['Content-Type'] = 'application/json';

 
  export default {
    name: 'PasswordInput',
    components: {
      AlertDialog
    },
    props: {
      dialog: Object,
      room: Object
    },
    setup(props) {
      const router = useRouter()
      const store = useStore()      
      const state = reactive({
        input: null,
        dialog : true,
        alert: false
      })
      const roominfo = ref(props.room);
      const checkPassword = async function() {
        state.alert = false
        if (state.input != roominfo.value.password) {
          await store.commit('accountStore/setAlertColor', 'error')
          await store.commit('accountStore/setAlertMessage', '비밀번호가 틀렸습니다.')
          await store.commit('accountStore/setAlertIcon', 'alert')
          state.alert = true
          return
        } else {
          store.commit("gameStore/setPassword", state.input);
          store.commit("gameStore/setTitle", roominfo.value.title);
          store.commit("gameStore/setTeam", roominfo.value.isTeamBattle);
          store.commit("gameStore/setSecret", roominfo.value.isSecret);
          store.commit("gameStore/setPassword", roominfo.value.password);
          router.push({
            name: "gameroom",
            params: { sessionId: roominfo.value.sessionId },
          });
        }
      }
      return {
        router, 
        state,
        checkPassword,

      }
    }
  }
</script>

<style scoped>

.formbox {
  padding: 2rem;
  width: 100%;
  border-radius: 20px;
  opacity: 100%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}

.my-custom-dialog {
  position: absolute;
  top: -70%
}
</style>