<template>
    <div>
  <div id='chat-area'>
    <div v-for="val in chat" v-bind:key="val.id">
            <div v-if="val.user === myUserNick" class="mychat">
               {{ val.text }}
            </div>
            <div v-else class="otherchat">
               {{ val.user }} : {{ val.text }}
            </div>
         
         </div>
    </div>
  <div class='chat_input'>
         <input v-model='chattings' @keyup.enter='sendMessage' placeholder="input message.." type="text" class="message_input"/>
         <button :disabled="!chattings" @click='sendMessage' type="submit" class="message_submit">Send</button>
    </div>
</div>
</template>

<script>
export default {
    name:'Chatting',
    data(){
        return{
            chattings:'',
            chat:[],
            myUserNick : null,
        }
    },
    props:{
        session: Object,
    },
    watch: {

    chat() {
   setTimeout(() => {
   var chatDiv = document.getElementById("chat-area");
   chatDiv.scrollTo({
      // document.body.scrollTop = document.body.scrollHeight;
      top: chatDiv.scrollHeight - chatDiv.clientHeight,
      behavior: 'smooth'
          })
      }, 50);
    },
    },
    created: function(){
        this.myUserNick = '내 이름'
        console.log('닉넴')
        console.log(this.myUserNick)
            /*
                신대득
                방 입장시 다른 사람들에게 알림
                추가 위치
             */
            this.session.on('signal:enter-chat', (event)=>{
              console.log(event.data);
            })
              //  방에 들어와 있는 모든 사람이 받는거
            this.session.on('signal:my-chat', (event) => {
            console.log('여기')
            console.log(event)
                // this.chatting_user = event.from.data["clientData"]
            console.log('내가 입력한 내용')
            console.log(event.data); // Message
              // const content = event.data.slice(1, -1) // Message
            console.log('입력한 사람')
            console.log(event.from.data); // Message
            const chatting_user = event.from.data.slice(15, -2)
            console.log(chatting_user)

            const aa = JSON.parse(event.data)
            console.log('aa')
            console.log(aa)
            if (aa.correct) {
               this.chat.push({
                   user: chatting_user,
                   text: `정답은 ${aa.answer}입니다.`
               });
            }
            else {
               this.chat.push({
                   user: chatting_user,
                   text: aa,
               });
            }
              });
        
    },
    methods:{
      /*
          신대득
          방 입장 알림
          추가 예정
       */
        enterMessage(){
          // post 같은 느낌 = signal
          this.session.signal({
            data : JSON.stringify(this.myUserNick),
            type : 'my-enter'
          }).then(()=>{
                console.log(this.myUserNick+"enter success");
              })
              .catch(error=>{
                console.log(error);
              })
        },
        sendMessage() {
            // post 같은 느낌 = signal
            this.session.signal({
                    data: JSON.stringify(this.chattings),
                    type: 'my-chat'
                })
                .then(() => {
                    this.chattings = '';
                    console.log('Message success');
                })
                .catch(error => {
                    console.log(error);
                })
        },
      },
}
</script>

<style>

</style>