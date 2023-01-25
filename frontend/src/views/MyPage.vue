<template>
    <div class="header">
        <h1>마이 페이지</h1>
    </div>
    <div class="main">
        <div class="section1">
            <div class="inner_section1_left">
                <img src="" alt="">
            </div>
            <div class="inner_section1_right">
                <h2>{{ nickname }}님</h2>
                <v-btn>회원정보 변경</v-btn>
                <p>승률 : {{ winrate }}%</p>
            </div>

        </div>
        <div class="section2">
            <h2>나의 경험치 <span>{{ exp }} exp</span></h2>

        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
export default {
    setup() {
        const exp = ref(2723)
        const nickname = ref('홍길동')
        const history = reactive({ plays: 11, wins: 3, throws: 2 })
        return {
            exp,
            nickname,
            history,
        }
    },
    computed: {
        winrate() {
            return this.history.wins/this.history.plays*100
        }
    }
}
</script>

<style>

</style>