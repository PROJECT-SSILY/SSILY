<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ attrs }">
        <v-btn
          dark
          v-bind="attrs"
          @click.stop="dialog = true"
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
          :rules="[rules.required]"
          v-model="row"
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
          :rules="[rules.required]"
          v-model="row2"
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
  export default {
    data () {
      return {
        dialog: false,
        row: null,
        row2: null,
        rules: {
          required: value => !!value || '필수',
        }
      }
    },
    methods: {
      toWaiting() {
        this.$router.push({name: 'waiting'})
      }
    }
  }
</script>