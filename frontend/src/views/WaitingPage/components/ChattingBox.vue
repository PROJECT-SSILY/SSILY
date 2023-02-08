<template>
    <div>
    <div id='chat-area'>
        <div v-for="val in chat" v-bind:key="val.id">
            <div v-if="val.user === nickname" class="mychat">
                <div>{{ val.text }}</div>
            </div>
            <div v-else class="otherchat">
                <div>{{ val.user }} : {{ val.text }}</div>
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
import { computed } from 'vue';
import { reactive } from '@vue/reactivity'
import { watch } from 'vue'

// watch,
export default {
    name:'ChattingBox',
    
    // props:{
    //     session: Object,
    // },
    
    setup() {
        const store = useStore()
        const chat = computed(() => store.state.gameStore.chat);
        const state = reactive({
            chattings:'',
            chat: [] ,
            userNick:'',
            sendData:'',
        })
        
        const nickname = store.state.accountStore.user.nickname || '';
        console.log("chattingBox nick", nickname);

        watch(() => chat, (newValue, oldValue) => {
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
            store.dispatch('gameStore/sendMessage', state.chattings)
            state.chattings = ''
        }
  
        return {
            store, 
            state, 
            nickname, 
            chat,
            // onMounted, 
            sendMessage
        }
    },

}
</script>

<style>

.mychat {
    border-radius: 10px;
    text-align: right;
    margin: 4px 0;
    display: flex;
    flex-direction: row-reverse;
}
.mychat>div {
    background: rgb(255, 217, 0);
    padding: 2px 10px;
    border-radius: 10px 10px 0 10px;
}
.otherchat {
    border-radius: 10px;
    text-align: left;
    margin: 4px 0;
    display: flex;
    flex-direction: row;
}
.otherchat>div {
    background: rgb(2, 2, 2);
    color: white;
    padding: 2px 10px;
    border-radius: 0 10px 10px 10px;
}
.chat_input {
    border-top: 1px solid gray;
    padding-top: 10px;
    margin-top: 10px;
}
</style>