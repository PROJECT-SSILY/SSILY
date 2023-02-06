<template>
    <div>
    <div id='chat-area'>
        <div v-for="val in state.chat" v-bind:key="val.id">
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
import { computed, onMounted, onUpdated } from 'vue';
import { reactive } from '@vue/reactivity'
import { watch } from 'vue'

// watch,
export default {
    name:'ChattingBox',
    
    props:{
        session: Object,
    },
    setup(props, {emit}) {
        onMounted(()=>{
            console.log("props Mounted언제냐", props.session);
            
            props.session.on('signal:my-chat', (event) => {
            console.log('-----------------------------------------')
            console.log('event : ', event)
            console.log('event.data : ', event.data)
            console.log('event.player : ', event.from.data); // Message
            console.log("myData", event.from.data);
            console.log('event.from : ', event.from)
            // const chatting_user = nickname
            const stringData=JSON.stringify(event.from.data)
            state.userNick=stringData.slice(19,stringData.length-4);

            state.sendData  = JSON.parse(event.data)
            // if (aa.correct) {
            //     state.chat.push({
            //        user: chatting_user,
            //        text: `정답은 ${aa.answer}입니다.`
            //    });
            // } else{
 
            // }

            state.chat.push({
                    user : state.userNick,
                    text : state.sendData,
                    id : event.from.connectionId,
                });
                emit("update:session", props.session);
            })
        })
        onUpdated(()=>{
            console.log("userNick은?", (state.userNick));
        })

        const store = useStore()
        // 시도
        const session1 = computed(() => props.session)

        // const nickname = computed(() => store.getters['accountStore/getUser'].nickname);
        const state = reactive({
            chattings:'',
            chat: [] ,
            userNick:'',
            sendData:'',
        })
        
        const nickname = store.state.accountStore.user.nickname || '';
        console.log("chattingBox nick", nickname);

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
            console.log("sendMessage 몇번 찍냐?");
            session1.value.signal({
                    data: JSON.stringify(state.chattings),
                    type: 'my-chat',
                })
                .then(() => {
                    // state.chat.push({ user: nickname, text: state.chattings})
                    state.chattings = '';
                    emit("update:session", session1.value);
                    console.log('Message success', state.chat);
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
        return {store, state, nickname, session1, onMounted, sendMessage}
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