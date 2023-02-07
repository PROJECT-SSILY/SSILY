<template>
  <div>
    <UserResult/>
    <div>
        <div class="sidebtn">
            <v-btn class="exitbtn" @click="clickExit">EXIT</v-btn>
        </div>
    </div>
  </div>
</template>

<script>
import UserResult from './components/UserResult.vue';

export default {
    name: 'ResultPage',
    components: {
        UserResult
    }

}
</script>

<style>
.sidebtn {
    display: inline-block;
    padding: 10px 0px;
    height: 70px;
    width: 150px;
}
.sidebtn:first-child {
    padding-right: 5px; 
}
.sidebtn:last-child {
    padding-left: 5px; 
}
.sidebtn>button {
    width:100%;
    margin: 0px;
    border-radius: 20px;
    height: 70px;
    box-sizing: border-box;
    font-family: sans-serif;
    font-weight: 900;
    font-size: 25px;
    border: 7px solid #ffffffeb;
}
.exitbtn {
    background: rgb(224,61,61);
    background: linear-gradient(133deg, rgba(224,61,61,1) 0%, rgba(255,93,93,1) 100%);
}
</style>