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
                                <v-avatar
                                size="128">
                                <img class="robot" :src="userinfo.robot" alt="">
                                </v-avatar>                                 
                            <div class="inner_section1_right">
                                <h2>{{ userinfo.nickname }}님</h2>
                            </div>    
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="my-5">
                    <v-row>
                        <v-col>                                
                            <v-card class="game-info">
                                <h3>LV. {{ userinfo.level }}</h3>
                                <h3>경험치</h3>
                                <h3>{{ userinfo.exprate }} % </h3>
                                <h3>승률 : {{ userinfo.record.winrate }} %</h3>
                            </v-card>
                        </v-col> 
                    </v-row>
                    <v-row>
                        <v-col cols="3">
                            <changeNicknameDialog/>
                        </v-col>
                        <v-col cols="3">
                            <changePasswordDialog/>
                        </v-col>
                        <v-col cols="3">
                            <v-btn 
                            block
                            @click="logOut">                                
                                LOGOUT
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn
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
                                <v-card>
                                    <v-card-text class="text-h5">
                                    정말 탈퇴하시렵니까?
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
                userinfo.robot = "@/assets/images/robotface1.svg"
            } else if (res.level > 5 && res.level < 11) {
                userinfo.robot = "@/assets/images/robotface2.svg"
            } else {
                userinfo.robot = "@/assets/images/robotface3.svg"
            }
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
            logOut,
            main,
            deleteAccount
        }
    },
}
</script>

<style scoped>
.game-info {
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.7);
}
#result .v-btn {
    min-width: 36px;
    width: 36px;
    background-color: rgba(255, 255, 255, 0.7)
  }
.robot {
    height: 5rem;
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
.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'MaplestoryOTFBold';
  font-weight: normal;
  font-style: normal;
}
</style>