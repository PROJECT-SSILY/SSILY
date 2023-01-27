<template>
    <div>
        <div class="header">
            <h1>마이 페이지</h1>
        </div>
        <div class="main">
            <div class="section1">
                <div class="inner_section1_left">
                    <img src="" alt="">
                </div>
                <div class="inner_section1_right">
                    <h2>{{ userinfo.nickname }}님</h2>
                    <v-btn>회원정보 변경</v-btn>
                    <!-- <p>승률 : {{ userinfo.winrate }}%</p>  -->
                </div>

            </div>
            <div class="section2">
                <h2>나의 경험치 <span>{{ userinfo.exp }} exp</span></h2>

            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'
export default {
    name: 'MyPage',
    setup() {
        const userinfo = reactive({ 
            nickname: "", 
            exp: 0, 
            plays: 11,
            wins: 3, 
            throws: 2,
            // winrate: userinfo.wins/userinfo.plays*100, 
        })

        return {
            userinfo,
        }
    },
}
</script>

<style>

</style>