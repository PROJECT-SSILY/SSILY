<template>
    <div>
        <GameTimer date="August 15, 2016"/>
        <v-btn @click="changeMode"
        >Change Mode
        </v-btn>
        <div v-if="state.isTeamGame">
            <h1>팀전</h1>
            <TeamGame/>
        </div>
        <div v-else>
            <h1>개인전</h1>
            <PrivateGame/>
        </div>
    </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
// import GameScore from './components/GameScore.vue';
import GameTimer from './components/GameTimer.vue';
// import MyCanvasBox from './components/MyCanvasBox.vue';
// import MyTeamCanvasBox from './components/MyTeamCanvasBox.vue';
import PrivateGame from './components/PrivateGame.vue';
import TeamGame from './components/TeamGame.vue';

export default {
    name : "InGamePage",
    components: {
        // GameScore,
        GameTimer,
        // MyCanvasBox,
        // MyTeamCanvasBox,
        PrivateGame,
        TeamGame,
        // VideoBox
    },
    setup() {
        const state = reactive({
            isTeamGame: true
        })
        const changeMode = () => {
            state.isTeamGame = !state.isTeamGame 
        }
        return {
            state,
            changeMode
        }
    }

}
</script>

<style scoped>

</style>