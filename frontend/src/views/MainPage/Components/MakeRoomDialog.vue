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
        <v-radio-group
          :rules="[state.rules.required]"
          v-model="state.teamorprivate"
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
          v-model="state.secretornot"
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
          v-if="state.secretornot ==='radio-2'"
          label="비밀번호 숫자 4자리를 입력하세요."
          hide-details="auto"
          v-model="state.password"
        ></v-text-field>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            type="submit"
            text
            @click="toWaiting"
          >
            방 만들기
          </v-btn>
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
  export default {
    setup() {
      const router = useRouter()
      const store = useStore()
      const state = reactive({
        dialog: false,
        teamorprivate: null,
        secretornot: null,
        password:null,
        rules: {
          required: value => !!value || '필수',
        }
      })
      const toWaiting = async function () {
        const formData = {
          teamorprivate: state.teamorprivate.value,
          isSecret: state.secretornot.value,
          password: state.password,
        }
        await store.dispatch('gameroomStore/roomAction', formData )
        await console.log("방 생성 완료")
        router.push('waiting')
      
      }
      return {
        router, 
        state,
        toWaiting
      }
    }
  }
</script>