<template>
    <div>
        <div class='area-chat' id="chatDiv">
            <div v-for="val in chat" v-bind:key="val.id">
                <div v-if="val.user === nickname" class="text-chat-me">
                    <div>{{ val.text }}</div>
                </div>
                <div v-else class="text-chat-other">
                    <div>{{ val.user }} : {{ val.text }}</div>
                </div>
            </div>
        </div>
        <div class='group-chat'>
            <input v-model='state.chattings' placeholder="input message.." @keyup.enter='sendMessage' type="text" class="input-chat"/>
            <button :disabled="!state.chattings" @click='sendMessage' type="submit" class="btn-submit-chat">Send</button>
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
    setup() {
        const store = useStore()
        const chat = computed(() =>{
            return store.state.gameStore.chat
            })
        const state = reactive({
            chattings:'',
            chat: [] ,
            userNick:'',
            sendData:'',
        })

        /*
        watch(
            chat.value,(cur, prev)=>{
                chatDiv.scrollTo({
                    top: chatDiv.scrollHeight - chatDiv.clientHeight,
                    behavior: 'smooth'
                    console.log(cur,prev);
                 })
            },
            {
                immediate: true,
            }
        )
        */
        
        const nickname = store.state.accountStore.user.nickname || '';
        console.log("chattingBox nick", nickname);

        watch(chat.value, (newValue, oldValue) => {
            console.log('chat변화감지', {newValue, oldValue })
            setTimeout(() => {
            var chatDiv = document.getElementById("chatDiv");
            chatDiv.scrollTo({
            top: chatDiv.scrollHeight,
            behavior: 'smooth'
                 })
            }, 50);
        })

        const sendMessage = () => {
            if(state.chattings!=''){
                store.dispatch('gameStore/sendMessage', state.chattings)
                state.chattings = ''
            }
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

<style scoped>
* {
    font-family: 'Noto Sans KR', sans-serif;
}
.area-chat {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px 25px;
    overflow-y: auto;
    overflow-x: hidden;
}
.group-chat {
    width: 100%;
    height: 50px;
    padding: 0 30px;
    border-top: 1px solid #00000014;
}
.input-chat  {
    width: 80%;
}
.btn-submit-chat {
    width: 20%;
    min-width: 80px;
}
.group-chat>button, .group-chat>input {
    height: inherit;
}
.text-chat-me {
    border-radius: 10px;
    text-align: right;
    margin: 4px 0;
    display: flex;
    flex-direction: row-reverse;
}
.text-chat-me>div {
    background: rgb(255, 217, 0);
    padding: 2px 10px;
    border-radius: 10px 10px 0 10px;
}
.text-chat-other {
    border-radius: 10px;
    text-align: left;
    margin: 4px 0;
    display: flex;
    flex-direction: row;
}
.text-chat-other>div {
    background: rgb(234 234 234);
    color: black;
    padding: 2px 10px;
    border-radius: 0 10px 10px 10px;
}
</style>