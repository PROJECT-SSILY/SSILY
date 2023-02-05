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
import { computed, onUpdated } from '@vue/runtime-core';
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
        // 정답 체크
        onUpdated(async () => {
            props.session.on('signal:my-chat', (event) => {
            console.log('-----------------------------------------')
            console.log('event : ', event)
            console.log('event.data : ', event.data)
            console.log('event.player : ', event.player); // Message
            console.log('event.from : ', event.from)

            const chatting_user = nickname

            const aa = JSON.parse(event.data)
            console.log('aa')
            console.log(aa)
            if (aa.correct) {
                state.chat.push({
                   user: chatting_user,
                   text: `정답은 ${aa.answer}입니다.`
               });
            }
              });
    })
        return {store, state, nickname, onUpdated, sendMessage}
    },

}
</script>

<style>

</style>