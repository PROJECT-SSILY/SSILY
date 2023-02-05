<template>
    <div>
        <div class="header">
            <h1>마이 페이지</h1>
        </div>
        <div class="main">
            <div class="section1">
                <div class="inner_section1_left">
                    <div>
                        <img class="robot" :src="userinfo.robot" alt="">
                    </div>
                </div>
                <div class="inner_section1_right">
                    <h2>{{ userinfo.nickname }}님</h2>
                    <v-row>
                        <v-col>
                            <changeNicknameDialog/>
                        </v-col>
                        <v-col>
                            <changePasswordDialog/>
                        </v-col>
                    </v-row>
                    
                    <p>승률 : {{ userinfo.record.winrate }}%</p>
                </div>
            </div>
            <div class="section2">
                <h5>나의 경험치 : <span>{{ userinfo.exp }} exp</span></h5>
                <h5>나의 레벨 : <span>{{ userinfo.exp }} level</span></h5>
            </div>
        </div>
        <div class="footer">
            <v-btn class="ma-2" @click="logOut">
                LOGOUT
            </v-btn>
            <v-btn class="ma-2" @click="main">
                MAIN
            </v-btn>
        </div>
    </div>
</template>

<script>
import ChangeNicknameDialog from './components/ChangeNicknameDialog.vue';
import ChangePasswordDialog from './components/ChangePasswordDialog.vue';
import { reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    name: 'MyPage',
    components: {
        ChangeNicknameDialog,
        ChangePasswordDialog
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const userinfo = reactive({
            name: "",
            nickname: "",
            level: 0,
            exp: 0,
            robot: null,
            record: {
                plays: 0,
                wins: 0,
                draws: 0,
                winrate: 0,
            }
        })
        onBeforeMount(async ()=> {
            const token = store.getters['accountStore/getToken']
            const res = await store.dispatch('accountStore/getMeAction', token)
            userinfo.name = res.name
            userinfo.nickname = res.nickname
            userinfo.level = res.level
            userinfo.exp = res.exp
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
        })
        const logOut = async function() {
            await store.dispatch('accountStore/logoutAction')
            router.push('/')
        }
        const main = function() {router.push('main')}

        return {
            userinfo,
            logOut,
            main,
        }
    },
}
</script>

<style>
.robot {
    height: 5rem;
}
</style>