<template>
    <div class="wrap-dialog">
    <div class="dialog">
      <div class="tit-dialog">MyPage</div>
      <div class="sec-img">
        <v-img :src="require(`@/assets/images/${userinfo.robot}.svg`)" alt="로봇" id="character" height="150px"/>
        </div>
        <p id="nickname"><b>{{ userinfo.nickname }}(LV. {{ userinfo.level }})</b> 님</p>
        <br>
        <table id="table-info">
            <tr>
                <td>이름  </td>
                <td>{{ userinfo.name }}</td>
            </tr>
            <tr>
                <td>이메일 </td>
                <td>{{ userinfo.email }}</td>
            </tr>
            <tr>
                <td>전적  </td>
                <td>{{ userinfo.record.plays }}전 {{ userinfo.record.wins }}승 {{ userinfo.record.draws }}패</td>
            </tr>
            <tr>
                <td>승률  </td>
                <td>{{ userinfo.record.winrate }}%</td>
            </tr>
            <tr>
                <td>경험치 </td>
                <td>{{ userinfo.exp }} EXP</td>
            </tr>
            </table>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onBeforeMount, reactive } from "vue";
  // import { watch } from "vue";
  import { useStore } from "vuex";

  export default {
    setup() {
      const store = useStore();
      const state = reactive({
      });
      const userinfo = reactive({
      dialog: false,
      name: "",
      nickname: "",
      email: "",
      level: 0,
      exp: 0,
      robot: computed(() => {
        if (userinfo.level >= 0 && userinfo.level < 6) {
          return "ssily1"
        } else if (userinfo.level >= 6 && userinfo.level < 11) {
          return "ssily2"
        } else {
          return "ssily3"
        }
      }),
      record: {
        plays: 0,
        wins: 0,
        draws: 0,
        winrate: computed(() => Math.floor(userinfo.record.wins/userinfo.record.plays*100)) 
      },
    });
    onBeforeMount(async () => {
      const token = store.getters["accountStore/getToken"];
      const res = await store.dispatch("accountStore/getMeAction", token);
      userinfo.name = res.name;
      userinfo.nickname = res.nickname;
      userinfo.email = res.email;
      userinfo.level = res.level;
      userinfo.exp = res.exp;
      userinfo.exprate = Math.floor(res.exp / res.level);
      userinfo.record.plays = res.record.plays;
      userinfo.record.wins = res.record.wins;
      userinfo.record.draws = res.record.draws;
      if (res.record.plays == 0) {
        userinfo.record.winrate = 0;
      } else {
        userinfo.record.winrate =
          Math.floor(res.record.wins / res.record.plays) * 100;
      }
    });
      return {
        state,
        userinfo,
        store
      };
    },
  };
  </script>
  
  <style scoped>
  .dialog {
    height: 100%;
    max-height: 500px;
    width: 500px;
  }
  .btn-dialog {
    background: #24CB83;
    color: #FFFFFF;
  }

    #table-info {
    text-align: left;
    color: #525252;
    }

    #table-info tr td{
        padding: 2px 3px;
        font-size: 15px;
    }
    #table-info tr td:first-child{
        font-weight: 600;
        padding-right: 10px;
    }
  
  
  
  
  
  
  
  
  
  /* ================ */
  /* .tutorial-planet {
    font-family: "Akronim", cursive;
    font-size: 2rem;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    transform: translate(-9px, -15px);
  }
  @keyframes shake-tutorial-planet {
    0% {
      transform: translate(-8px, -14px);
    }
    33% {
      transform: translate(-10px, -14px);
    }
    66% {
      transform: translate(-10px, -16px);
    }
    100% {
      transform: translate(-8px, -16px);
    }
  }
  
  .tutorial-planet:hover {
    animation: shake-tutorial-planet 0.1s infinite alternate;
  }
  
  .formbox {
    padding: 2rem;
    margin-top: 10%;
    width: 100%;
    border-radius: 20px;
    opacity: 100%;
    font-family: "MaplestoryOTFBold";
    font-weight: normal;
    font-style: normal;
  } */
  </style>