<template>
    <div>
    <div id='chat-area'>
        <div v-for="val in state.chat" v-bind:key="val.id">
            <div v-if="val.user === nickname" class="mychat">
                    {{ val.text }}
                </div>
                <div v-else class="otherchat">
                    {{ val.user }} : {{ val.text }}
                </div>
            </div>
        </div>
    <div class='chat_input'>
            <input v-model='state.chattings' placeholder="input message.." @keyup.enter='sendMessage' type="text" class="message_input"/>
            <button :disabled="!state.chattings" @click='sendMessage' type="submit" class="message_submit">Send</button>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { reactive } from '@vue/reactivity'
import { computed, onMounted, onUpdated } from '@vue/runtime-core';
import { watch } from 'vue'
// watch,
export default {
    name:'ChattingBox',
    
    props:{
        session: Object,
    },
    setup(props) {
        const store = useStore()
        const nickname = computed(() => store.getters['accountStore/getUser'].nickname);
        const state = reactive({
            chattings:'',
            chat: [] ,
        })
        watch(() => state.chat, (newValue, oldValue) => {
            console.log('chat변화감지', {newValue, oldValue })
            setTimeout(() => {
            var chatDiv = document.getElementById("chat-area");
            chatDiv.scrollTo({
            top: chatDiv.scrollHeight - chatDiv.clientHeight,
            behavior: 'smooth'
                 })
            }, 50);
        })
        const sendMessage = () => {
            props.session.signal({
                    data: JSON.stringify(state.chattings),
                    type: 'my-chat'
                })
                .then(() => {
                    state.chat.push({ user: nickname, text: state.chattings})
                    state.chattings = '';
                    console.log('Message success');
                })
                .catch(error => {
                    console.log(error);
                })
        }
        console.log("store.state.gameStore.messages : ", store.state.gameStore.messages)
        onMounted(() => {
            console.log(store.state.gameStore.messages)
        })
        onUpdated(() => {
            console.log(store.state.gameStore.messages)
        })
        watch(()=>store.state.gameStore.messages, () => {
            console.log(store.state.gameStore.messages)
        });
        return {store, state, nickname, onUpdated, sendMessage}
    },

}
</script>

<style>

</style>