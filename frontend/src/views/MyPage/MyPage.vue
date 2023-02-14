<template>
    <div>
        <div id="result" class="d-flex flex-row-reverse mx-4 my-4">
            <v-btn 
            class="v-btn"
            @click="main">
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>
        </div>
        <v-container class="profile">
            <v-row>
                <v-col>
                    <v-row>
                        <v-col>
                            <h1>마이 페이지</h1>                                                             
                            <div class="robot-circle">
                                <img class="robot" :src="userinfo.robot" alt="">
                            </div>
                            <div class="win-rate">    
                                <apexchart width="380" type="donut" :options="donutchart.options" :series="donutchart.series"></apexchart>
                            </div>
                            <br>
                            <div class="inner_section1_right">
                                <h2>{{ userinfo.nickname }}</h2>
                            </div>    
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="my-5">
                    <v-row>
                        <v-col>                                
                            <v-card class="game-info">
                                <p align="left">LV. {{ userinfo.level }}</p>
                                <p align="left">경험치</p>
                                <p align="right">{{ userinfo.exprate }} % </p>
                                <div class="win-rate">    
                                    <apexchart class="chart" width="200" type="bar" :options="linechart.options" :series="linechart.series"></apexchart>
                                </div>
                            </v-card>
                        </v-col> 
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <changeNicknameDialog/>
                        </v-col>
                        <v-col cols="6">
                            <changePasswordDialog/>
                        </v-col>
                        <v-col cols="6">
                            <v-btn
                            id="logout-btn" 
                            x-large
                            block
                            @click="logOut">                                
                                LOGOUT
                            </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn
                            id="delete-btn"
                            x-large
                            block
                            color="error"
                            dark
                            @click.stop="userinfo.dialog = true"
                            >
                            회원 탈퇴
                            </v-btn>
                            <v-dialog
                                v-model="userinfo.dialog"
                                max-width="290"
                                >
                                <v-card class="formbox">
                                    <v-card-text>
                                    정말 탈퇴하시겠습니까?
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" text @click="deleteAccount">탈퇴</v-btn>
                                        <v-btn color="success" text @click="userinfo.dialog = false">취소</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>                                            
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import ChangeNicknameDialog from './components/ChangeNicknameDialog.vue';
import ChangePasswordDialog from './components/ChangePasswordDialog.vue';
import { reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    name: 'MyPage',
    components: {
        ChangeNicknameDialog,
        ChangePasswordDialog,
        apexchart: VueApexCharts,

    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const userinfo = reactive({
            dialog: false,
            name: "",
            nickname: "",
            level: 0,
            exp: 0,
            exprate: 0,
            robot: null,
            record: {
                plays: 0,
                wins: 0,
                draws: 0,
                winrate: 0,
            }
        })
        const donutchart = reactive({
            records: userinfo.record,
            win : userinfo.record.wins,
            lost: userinfo.record.plays - userinfo.record.wins - userinfo.record.draws,
            options: {
                chart: {
                    type: "radialBar",
                    height: 250,
                    offsetX: 0
                },
                labels: ["승", "패"],
                legend: {
                    show: false,
                },
                fill: {
                    colors: ['#8DFCAC', '#EAFFF0']
                },
                dataLabels: {
                    enabled: false
                },
                
            },
            series: []
        })
        const linechart = reactive({
            options: {
                chart: {
                    height: 70,
                    type: "bar",
                    stacked: true,
                    sparkline: {
                    enabled: true
                    }
                },
                labels: ["경험치"],
                legend: {
                    show: false,
                },
                fill: {
                    colors: ['#8DFCAC']
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                        barHeight: "20%",
                        colors: {
                            backgroundBarColors: ["#EAFFF0"],
                            backgroundBarRadius: 5,
                        }
                    }
                },
            },
            series: [
                {
                name: "경험치",
                data: []
                }
            ],
        })
        onBeforeMount(async ()=> {
            const token = store.getters['accountStore/getToken']
            const res = await store.dispatch('accountStore/getMeAction', token)
            userinfo.name = res.name
            userinfo.nickname = res.nickname
            userinfo.level = res.level
            userinfo.exp = res.exp
            userinfo.exprate = res.exp / res.level 
            userinfo.record.plays = res.record.plays
            userinfo.record.wins = res.record.wins
            userinfo.record.draws = res.record.draws
            if (res.record.plays == 0) {
                userinfo.record.winrate =  0
            } else {
                userinfo.record.winrate =  res.record.wins/res.record.plays*100
            }
            if (res.level > -1 && res.level < 6)  {
                userinfo.robot = "./robotface1.svg"
            } else if (res.level > 5 && res.level < 11) {
                userinfo.robot = "./robotface2.svg"
            } else {
                userinfo.robot = "./robotface3.svg"
            }
            donutchart.series.push(2)
            // donutchart.series.push(donutchart.win)
            donutchart.series.push(1)
            // donutchart.series.push(donutchart.lost)
            linechart.series[0].data.push(80)
            // linechart.series[0].data.push(userinfo.exp)
        })
        const logOut = async function() {
            await store.dispatch('accountStore/logoutAction')
            router.push('/')
        }
        const main = function() {router.push('main')}
        const deleteAccount = async function() {
            await store.dispatch('accountStore/deleteAction')
            // await router.push('/')
            await router.push('/')
        }
        return {
            userinfo,
            donutchart,
            linechart,
            logOut,
            main,
            deleteAccount
        }
    },
}
</script>

<style scoped>
.game-info {
    align-items: flex-start;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 8px 8px rgba(0,0,0,0.11), 
                0 16px 16px rgba(0,0,0,0.11), 
                0 32px 32px rgba(0,0,0,0.11);
}
#result .v-btn {
    min-width: 36px;
    width: 36px;
    background-color: rgba(255, 255, 255, 0.);
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 8px 8px rgba(0,0,0,0.11), 
                0 16px 16px rgba(0,0,0,0.11), 
                0 32px 32px rgba(0,0,0,0.11);
  }
.robot {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 5rem;
}
.robot-circle {
    position: relative; 
    z-index: 3;
    right: 0rem;
    top: 12rem;
    
}
.win-rate {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    font-family: 'MaplestoryOTFBold';
    font-weight: normal;
    font-style: normal;

}
.game-info > p {
    font-size: 2rem;
    font-family: 'MaplestoryOTFBold';
    font-weight: normal;
    font-style: normal;

}

.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
  color:#ffffff;
}
#delete-btn {
    height:3rem;
    font-size: 1.5rem;
    opacity: 89%;
    border-radius:10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 8px 8px rgba(0,0,0,0.11), 
                0 16px 16px rgba(0,0,0,0.11), 
                0 32px 32px rgba(0,0,0,0.11);
}
#logout-btn {
    height:3rem;
    font-size: 1.5rem;
    opacity: 89%;
    border-radius:10px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
                0 2px 2px rgba(0,0,0,0.11), 
                0 4px 4px rgba(0,0,0,0.11), 
                0 8px 8px rgba(0,0,0,0.11), 
                0 16px 16px rgba(0,0,0,0.11), 
                0 32px 32px rgba(0,0,0,0.11);
}
.formbox {
    width: 100%;
    border-radius: 20px;
    opacity: 100%;
    font-family: 'MaplestoryOTFBold';
    font-weight: normal;
    font-style: normal;
  }

</style>