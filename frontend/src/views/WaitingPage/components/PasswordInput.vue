<template>
  <div class="text-center">
    <v-dialog
      v-model="state.dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ attrs }
      ">
        <v-btn
          dark
          v-bind="attrs"
          @click.stop="state.dialog = true"
        >
        입장
        </v-btn>
      </template>

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
          </v-card-actions>
      </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import { reactive, computed } from 'vue'
  import { useStore } from 'vuex'
  import $axios from "axios";

  $axios.defaults.headers.post['Content-Type'] = 'application/json';

 
  export default {
    name: 'PasswordInput',
    props: {
      dialog: Object
    },
    setup() {
      const router = useRouter()
      const store = useStore()      
      const state = reactive({
        input: null,
        dialog : true
      })
      const password = computed(() => store.state.gameStore.password)
      const checkPassword = function() {
        if (state.input != password.value) {
          alert('비밀번호가 일치하지 않습니다!')
          return
        } else {
          state.dialog = false
        }
      }
      return {
        router, 
        state,
        password,
        checkPassword
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
</style>