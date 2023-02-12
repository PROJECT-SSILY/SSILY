<template>
  <div class="background">
    <div id="stars" class="rotating">
    </div>
  </div>
  <div id="contents">
    <router-view/>
  </div>
</template>


<script>


</script>

<style>
@import '@/assets/css/base.css';
@font-face {
  font-family: 'MaplestoryOTFBold';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/MaplestoryOTFBold.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
}
.background{
  width: 100vw;
  background: linear-gradient(rgba(12,111,202,1), rgba(38,0,111,1));
  opacity: 1;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: absolute;
}
#stars{
  position: relative;
  left: -30%;
  bottom: 100%;
  height: 300%;
  margin:0;  
  background-image: url("@/assets/images/stars3.svg");
  background-size: contain;
  background-position: center;
  overflow: hidden;
  animation: rotation 120s infinite linear;
}
@keyframes rotation {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

#contents {
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}


.btnbox {
  display: flex;
}
</style>
