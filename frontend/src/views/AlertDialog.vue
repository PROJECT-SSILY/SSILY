<template>
    <v-dialog class="my-custom-dialog"
        transition="dialog-top-transition"
        v-model="state.alert"
        max-width="500"
    >
        <v-card class="formbox">
        <v-card-title>
            <v-icon
            :color="color"
            >mdi-{{ icon }}-circle</v-icon>
            {{ message }}
        </v-card-title>
        <v-card-text>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            :color="color"
            text
            @click.stop ="state.alert = false"
            >
            확인
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { computed } from 'vue'
import { useStore } from 'vuex';

export default {
    name: 'AlertDialog',
    setup() {
        const store = useStore()
        const state = reactive({
          alert: true,
        })
        const color = computed(() => store.state.accountStore.alertColor)
        const message = computed(() => store.state.accountStore.alertMessage)
        const icon = computed(() => store.state.accountStore.alertIcon)
        
        return {
            state,
            store,
            color,
            message,
            icon
        }
    }
}
</script>

<style scoped>
.my-custom-dialog {
    position: absolute;
    top: -70%
  }
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