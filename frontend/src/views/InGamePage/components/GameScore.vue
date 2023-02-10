<template>
  <div class="score-box">
    <v-container>
      <v-row>
        <v-col>
          <div>
            <h1>Score Board</h1>
          </div>
        </v-col>
      </v-row>
      <v-row
      >
      <v-col 
      v-for="user in userList"
      :user="user"
      :key="user.id"
      class="my-score">
        <v-row>
          <v-col>

            {{ user.nickname }}
          </v-col>
        
        </v-row>
        <v-row>
          <v-col>

            {{ user.score }}
          </v-col>
          
        </v-row>
      </v-col>
      <!-- <v-col>

        <div class="cd-number-wrapper">
          <span class="cd-number-five">5</span>
          <span class="cd-number-four">4</span>
          <span class="cd-number-three">3</span>
          <span class="cd-number-two">2</span>
          <span class="cd-number-one">1</span>
        </div>
      </v-col> -->
    </v-row>
  </v-container>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { reactive } from "vue";

export default {
  name: 'GameScore',
  setup() {
    const store = useStore();
    // const userList = computed(() => store.state.gameStore.userList);
    const userList = reactive({
      1 : {
        nickname: "득득",
        score: 1
      },
      2 : {
        nickname: "미미",
        score: 1
      },
      3 : {
        nickname: "탁탁",
        score: 1
      },
      4 : {
        nickname: "혁혁",
        score: 1
      },
    })
    return {
      store,
      userList
    }
  }
}
</script>

<style>
.score-box {
  display: flex;
  background-color: #ffffffeb;
  justify-content: center;
  width: 100%;
  padding:10px;
  border-radius: 10px;
  opacity: 100%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
.my-score {
  display: flex;
  background-color:rgb(192, 246, 192);
  justify-content: center;
  width: 80%;
  border-radius: 10px;
  margin: 10px;
  opacity: 100%;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}

.cd-number-wrapper {
	width: 80px;
	height: 189px;
	top: 50%;
	margin: 80px auto 0 auto;
	font-size: 10em;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
	
.cd-number-five {
	position: absolute;
	opacity: 0;
	margin: 0 auto 0 auto;
	-webkit-animation: cd-number-five-anim 1.2s ease 0s 1 normal;
	-moz-animation: cd-number-five-anim 1.2s ease 0s 1 normal;
	-ms-animation: cd-number-five-anim 1.2s ease 0s 1 normal;
	-o-animation: cd-number-five-anim 1.2s ease 0s 1 normal;
	animation: cd-number-five-anim 1.2s ease 0s 1 normal;
}

@-webkit-keyframes cd-number-five-anim {
	from {-webkit-transform: scale(0.5); opacity: 0;}
	to {  -webkit-transform: scale(1.3); opacity: 1;}}
	
@-moz-keyframes cd-number-five-anim {
	from {-moz-transform: scale(0.5); opacity: 0;}
	to {  -moz-transform: scale(1.3); opacity: 1;}}
	
@-o-keyframes cd-number-five-anim {
	from {-o-transform: scale(0.5); opacity: 0;}
	to {  -o-transform: scale(1.3); opacity: 1;}}
	
@-ms-keyframes cd-number-five-anim {
	from {-ms-transform: scale(0.5); opacity: 0;}
	to {  -ms-transform: scale(1.3); opacity: 1;}}
	
@keyframes cd-number-five-anim {
	from {transform: scale(0.5); opacity: 0;}
	to {  transform: scale(1.3); opacity: 1;}}

.cd-number-four {
	position: absolute;
	opacity: 0;
	-webkit-animation: cd-number-four-anim 1.2s ease 1.2s 1 normal;
	-moz-animation: cd-number-four-anim 1.2s ease 1.2s 1 normal;
	-ms-animation: cd-number-four-anim 1.2s ease 1.2s 1 normal;
	-o-animation: cd-number-four-anim 1.2s ease 1.2s 1 normal;
	animation: cd-number-four-anim 1.2s ease 1.2s 1 normal;
}

@-webkit-keyframes cd-number-four-anim {
	from {-webkit-transform: scale(0.5); opacity: 0;}
	to {  -webkit-transform: scale(1.3); opacity: 1;}}
	
@-moz-keyframes cd-number-four-anim {
	from {-moz-transform: scale(0.5); opacity: 0;}
	to {  -moz-transform: scale(1.3); opacity: 1;}}
	
@-o-keyframes cd-number-four-anim {
	from {-o-transform: scale(0.5); opacity: 0;}
	to {  -o-transform: scale(1.3); opacity: 1;}}
	
@-ms-keyframes cd-number-four-anim {
	from {-ms-transform: scale(0.5); opacity: 0;}
	to {  -ms-transform: scale(1.3); opacity: 1;}}
	
@keyframes cd-number-four-anim {
	from {transform: scale(0.5); opacity: 0;}
	to {  transform: scale(1.3); opacity: 1;}}

.cd-number-three {
	position: absolute;
	opacity: 0;
	-webkit-animation: cd-number-three-anim 1.2s ease 2.4s 1 normal;
	-moz-animation: cd-number-three-anim 1.2s ease 2.4s 1 normal;
	-ms-animation: cd-number-three-anim 1.2s ease 2.4s 1 normal;
	-o-animation: cd-number-three-anim 1.2s ease 2.4s 1 normal;
	animation: cd-number-three-anim 1.2s ease 2.4s 1 normal;
}

@-webkit-keyframes cd-number-three-anim {
	from {-webkit-transform: scale(0.5); opacity: 0;}
	to {  -webkit-transform: scale(1.3); opacity: 1;}}
	
@-moz-keyframes cd-number-three-anim {
	from {-moz-transform: scale(0.5); opacity: 0;}
	to {  -moz-transform: scale(1.3); opacity: 1;}}
	
@-o-keyframes cd-number-three-anim {
	from {-o-transform: scale(0.5); opacity: 0;}
	to {  -o-transform: scale(1.3); opacity: 1;}}
	
@-ms-keyframes cd-number-three-anim {
	from {-ms-transform: scale(0.5); opacity: 0;}
	to {  -ms-transform: scale(1.3); opacity: 1;}}
	
@keyframes cd-number-three-anim {
	from {transform: scale(0.5); opacity: 0;}
	to {  transform: scale(1.3); opacity: 1;}}

.cd-number-two {
	position: absolute;
	opacity: 0;
	-webkit-animation: cd-number-two-anim 1.2s ease 3.6s 1 normal;
	-moz-animation: cd-number-two-anim 1.2s ease 3.6s 1 normal;
	-ms-animation: cd-number-two-anim 1.2s ease 3.6s 1 normal;
	-o-animation: cd-number-two-anim 1.2s ease 3.6s 1 normal;
	animation: cd-number-two-anim 1.2s ease 3.6s 1 normal;
}

@-webkit-keyframes cd-number-two-anim {
	from {-webkit-transform: scale(0.5); opacity: 0;}
	to {  -webkit-transform: scale(1.3); opacity: 1;}}
	
@-moz-keyframes cd-number-two-anim {
	from {-moz-transform: scale(0.5); opacity: 0;}
	to {  -moz-transform: scale(1.3); opacity: 1;}}
	
@-o-keyframes cd-number-two-anim {
	from {-o-transform: scale(0.5); opacity: 0;}
	to {  -o-transform: scale(1.3); opacity: 1;}}
	
@-ms-keyframes cd-number-two-anim {
	from {-ms-transform: scale(0.5); opacity: 0;}
	to {  -ms-transform: scale(1.3); opacity: 1;}}
	
@keyframes cd-number-two-anim {
	from {transform: scale(0.5); opacity: 0;}
	to {  transform: scale(1.3); opacity: 1;}}

.cd-number-one {
	position: absolute;
	opacity: 0;
	-webkit-animation: cd-number-one-anim 1.2s ease 4.8s 1 normal;
	-moz-animation: cd-number-one-anim 1.2s ease 4.8s 1 normal;
	-ms-animation: cd-number-one-anim 1.2s ease 4.8s 1 normal;
	-o-animation: cd-number-one-anim 1.2s ease 4.8s 1 normal;
	animation: cd-number-one-anim 1.2s ease 4.8s 1 normal;
}

@-webkit-keyframes cd-number-one-anim {
	from {-webkit-transform: scale(0.5); opacity: 0;}
	to {  -webkit-transform: scale(1.3); opacity: 1;}}
	
@-moz-keyframes cd-number-one-anim {
	from {-moz-transform: scale(0.5); opacity: 0;}
	to {  -moz-transform: scale(1.3); opacity: 1;}}
	
@-o-keyframes cd-number-one-anim {
	from {-o-transform: scale(0.5); opacity: 0;}
	to {  -o-transform: scale(1.3); opacity: 1;}}
	
@-ms-keyframes cd-number-one-anim {
	from {-ms-transform: scale(0.5); opacity: 0;}
	to {  -ms-transform: scale(1.3); opacity: 1;}}
	
@keyframes cd-number-one-anim {
	from {transform: scale(0.5); opacity: 0;}
	to {  transform: scale(1.3); opacity: 1;}}
</style>