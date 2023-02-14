<template>
  <div class="wrap-dialog">
    <div class="dialog"
    v-if="room.isSecret && tmp==room.sessionId">
      <!-- <v-dialog
        v-model="state.dialog"
        v-if="room.isSecret && tmp==room.sessionId"
        hide-overlay
        transition="dialog-bottom-transition"
      >  -->
      <div class="tit-dialog">비밀번호 입력</div>
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
                <button class="btn-dialog"
                @click="checkPassword">참가하기</button>
              </p>
              <alert-dialog v-if="state.alert"/>
            </v-card-actions>
        </v-form>
    <!-- </v-dialog> -->
  </div>
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
      // Dialog: Boolean,
      room: Object,
      tmp: String,
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
        // console.log(Dialog);
        console.log(roominfo.value);
        if (state.input != roominfo.value.password) {
          state.alert = false
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

.dialog {
  background: #FFFFFF;
  height: 100%;
  max-height: 500px;
  width: 500px;
}
.btn-dialog {
  background: #24CB83;
  color: #FFFFFF;
}
</style>