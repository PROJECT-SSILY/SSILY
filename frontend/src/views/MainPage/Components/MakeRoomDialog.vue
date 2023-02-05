<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }">
        <v-btn
          dark
          v-bind="attrs"
          @click.stop="state.dialog = true"
        >
          방 만들기
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          방 만들기
        </v-card-title>
        <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        >
          <div id="join" v-if="!state.session">
            <div id="join-dialog" class="jumbotron vertical-center">
              <div class="form-group">
                <v-text-field
                v-model="state.title"
                class="form-control"
                label="방 제목"
                type="text"
                required></v-text-field>
              </div>
            </div>
          </div>
          <v-radio-group
            :rules="[state.rules.required]"
            v-model="state.isTeamBattle"
            inline
          >
            <v-radio
              label="팀전"
              color="orange darken-3"
              value="radio-1"
            ></v-radio>
            <v-radio
              label="개인전"
              color="orange darken-3"
              value="radio-2"
            ></v-radio>
          </v-radio-group>
          <v-radio-group
            :rules="[state.rules.required]"
            v-model="state.isSecret"
            inline
          >
            <v-radio
              label="공개"
              color="orange darken-3"
              value="radio-1"
            ></v-radio>
            <v-radio
              label="비공개"
              color="orange darken-3"
              value="radio-2"
            ></v-radio>
          </v-radio-group>
          <v-text-field
            v-if="state.isSecret ==='radio-2'"
            label="비밀번호 숫자 4자리를 입력하세요."
            hide-details="auto"
            v-model="state.password"
          ></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <p class="text-center">
              <v-btn
              @click="joinSession()">Join!</v-btn>
            </p>
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
  // import { computed } from 'vue'
  import $axios from "axios";

  $axios.defaults.headers.post['Content-Type'] = 'application/json';
  const OPENVIDU_SERVER_URL = "https://localhost:4443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";

  export default {
    setup() {
      const router = useRouter()
      const store = useStore()
      const state = reactive({
        dialog: false,
        title: null,
        isSecret : null,
        password : null,
        isTeamBattle : null,
        rules: {
          required: value => !!value || '필수',
        }
      })
      const joinSession = async function() {
        store.commit('gameStore/setMySessionId', '')// 시험
        if (state.isTeamBattle === "radio-1") {
          console.log("team 적용됨")
          state.isTeamBattle = true
        } else {
          state.isTeamBattle = false
        }

        if (state.isSecret === "radio-1") {
          state.isSecret = false
        } else {
          state.isSecret = true
        }
        console.log(state.title);
        console.log(state.isSecret);
        console.log(state.password);
        console.log(state.isTeamBattle);
        store.commit('gameStore/setTitle', state.title)
        store.commit('gameStore/setSecret', state.isSecret)
        store.commit('gameStore/setPassword', state.password)
        store.commit('gameStore/setTeam', state.isTeamBattle)

        // 세션을 먼저 만든 후 세션ID를 발급받아 해당 URL로 이동
        const sessionId = await createSession()
        router.push({name: 'gameroom', params: { sessionId : sessionId }})
      }

      const createSession = () => {
          let sessionId = null
          return new Promise((resolve, reject) => {
              $axios
              .post(`${OPENVIDU_SERVER_URL}/api/rooms`, JSON.stringify({
              "title" : state.title,
              "isSecret" : state.isSecret,
              "password" : state.password,
              "team" : state.isTeamBattle
              }), {
                  auth: {
                      username: 'OPENVIDUAPP',
                      password: OPENVIDU_SERVER_SECRET,
                  },
              })
              .then(response => response.data)
              .then(data => {
                  resolve(data.id)
              })
              .catch(error => {
                  if (error.response.status === 409) {
                      resolve(sessionId);
                  } else {
                      console.warn(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`);
                      if (window.confirm(`No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at "${OPENVIDU_SERVER_URL}"`)) {
                          location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
                      }
                      reject(error.response);
                  }
              });
          });
      }

      return {
        router,
        state,
        joinSession,
        createSession,
        // == OpenVidu State ==
        // OV,
        // session,
        // mainStreamManager,
        // publisher,
        // subscribers,
        // mySessionId,
        // myUserName,
        // =====================
      }
    }
  }
</script>