<template>
    <changeNicknameDialog />
    <changePasswordDialog />
<!-- <v-btn id="logout-btn" @click="logOut"> LOGOUT </v-btn>
<v-btn id="delete-btn" @click.stop="userinfo.dialog = true">회원 탈퇴</v-btn> -->
<v-dialog v-model="userinfo.dialog" max-width="290">
    <v-card class="formbox">
        <v-card-text> 정말 탈퇴하시겠습니까? </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="deleteAccount">탈퇴</v-btn>
            <v-btn color="success" text @click="userinfo.dialog = false"
            >취소</v-btn
            >
        </v-card-actions>
    </v-card>
</v-dialog>
<div class="background">
    <div id="stars" class="rotating"></div>
</div>
<div class="wrap-page">
    <div class="inner-page">
        <div class="sec-img">
            <v-img :src="userinfo.robot" alt="로봇" id="character"/>
        </div>
        <p id="nickname"><b>{{ userinfo.nickname }}(LV. {{ userinfo.level }})</b> 님</p>
        <table id="table-info">
            <tr>
                <td>이름</td>
                <td>{{ userinfo.name }}</td>
            </tr>
            <tr>
                <td>이메일</td>
                <td>{{ userinfo.email }}</td>
            </tr>
            <tr>
                <td>전적</td>
                <td>{{ userinfo.record.plays }}전 {{ userinfo.record.wins }}승 {{ userinfo.record.draws }}무 {{ userinfo.record.loses }}패</td>
            </tr>
        </table>
        <div class="wrap-table-rate">
            <table id="rate" class="table-rate">
                <tr>승률</tr>
                <tr>{{ userinfo.record.winrate }}%</tr>
            </table>
            <table id="exp" class="table-rate">
                <tr>경험치</tr>
                <tr>{{ userinfo.exp }} EXP</tr>
            </table>
        </div>  
        <div class="wrap-btn">
            <div class="group-btn">
                <button class="btn-mypage">닉네임 변경</button>
                <button class="btn-mypage">비밀번호 변경</button>
            </div>
            <button class="btn-mypage btn-logout" @click="logOut">로그아웃</button>
        </div>
        <span @click.stop="userinfo.dialog = true">회원 탈퇴</span>
    </div>
</div>
<FooterBox/>
<div class="background">
    <div id="stars" class="rotating"></div>
</div>
</template>
<script>
import { reactive, onBeforeMount, computed } from "vue";
import FooterBox from "../MainPage/Components/FooterBox.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "MyPage",
  components: {
    FooterBox,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userinfo = reactive({
      dialog: false,
      name: "",
      nickname: "",
      email: "",
      level: 0,
      exp: 0,
      robot: null,
      record: {
        plays: 0,
        wins: 0,
        draws: 0,
        loses: 0,
        winrate: computed(() => userinfo.record.wins/userinfo.record.plays*100) 
      },
    });
    const linechart = reactive({
      options: {
        chart: {
          type: "bar",
          stacked: true,
          sparkline: {
            enabled: true,
          },
        },
        labels: ["경험치"],
        legend: {
          show: false,
        },
        fill: {
          colors: ["#8DFCAC"],
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: "70%",
            columnWidth: "120%",
            colors: {
              backgroundBarColors: ["#EAFFF0"],
              backgroundBarRadius: 5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
        yaxis: {
          max: 100,
        },
      },
      series: [
        {
          name: "경험치",
          data: [],
        },
      ],
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
      if (res.level > -1 && res.level < 6) {
        userinfo.robot = "./ssily1.svg";
      } else if (res.level > 5 && res.level < 11) {
        userinfo.robot = "./ssily2.svg";
      } else {
        userinfo.robot = "./ssily3.svg";
      }
      linechart.series[0].data.push(userinfo.exprate);
    });

    const logOut = async function () {
      await store.dispatch("accountStore/logoutAction");
      router.push("/");
    };

    const main = function () {
      router.push("main");
    };

    const deleteAccount = async function () {
      await store.dispatch("accountStore/deleteAction");
      // await router.push('/')
      await router.push("/");
    };
    return {
      userinfo,
      linechart,
      logOut,
      main,
      deleteAccount,
    };
  },
};
</script>

<style lang="scss" scoped>
.inner-page {
    margin-left: 35px;
    margin-top: 35px;
    width: 700px;
    height: 400px;
    background: white;
    border-radius: 50px;
    box-shadow: 0 3px 10px 0 #0000005c;
    padding: 35px 35px 35px 390px;
    position: relative;
}
.sec-img {
    width: 400px;
    height: 400px;
    background: #DBDBDB;
    border-radius: 30px;
    position: absolute;
    top: -35px;
    left: -35px;
    padding: 20px;
    box-shadow: 2px 2px 7px 0 rgb(0 0 0 / 36%);
}
#nickname {
    font-size: 20px;
    text-align: left;
    margin-bottom: 15px;
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 5px;
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
.wrap-table-rate {
    display: flex;
    flex-direction: row;
    margin: 10px 0 25px 0;
    border-radius: 5px;
    color: #646464;
    background: #f1f1f1;
}
.table-rate {
    width: 50%;
    padding: 10px 5px;
    font-size: 16px;
}
.table-rate:first-child {
    margin-right: 9px;
}
.table-rate:last-child {
    margin-left: 9px;
}
.table-rate>tr:first-child {
    font-weight: 600;
}
.table-info>tr {
    text-align: center;
}
.btn-mypage {
    width: 100%;
    padding: 3px 10px;
    background: #f1f1f1;
    color: #838383;
    font-size: 15px;
    height: 35px;
}
.wrap-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.group-btn {
    width: 50%;
    display: inline-block;
    margin-right: 3px;
    line-height: initial;
}
.group-btn .btn-mypage:hover {
    background: #e7e7e7;
}
.group-btn>.btn-mypage:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.group-btn>.btn-mypage:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.btn-logout {
    display: inline-block;
    background: #e46b6b;
    color: white;
    border-radius: 10px;
    width: 50%;
    height: 70px;
    margin-left: 3px;
}
.btn-logout:hover {
    background: #ff3030;
}
</style>