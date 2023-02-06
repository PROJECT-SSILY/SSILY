<template>
  <div class="background">
    <div id="stars" class="rotating">
    </div>
    <div id="contents">
      <router-view/>
    </div>
  </div>
</template>


<script>


</script>

<style>
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
}
.background{
  width: 100%;
  background: linear-gradient(rgba(12,111,202,1), rgba(38,0,111,1));
  opacity: 1;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: relative;
}
#stars{
  position: relative;
  height: 100vh;
  margin:0;  background-image: url("./assets/stars3.svg");
  background-size: contain;
  background-position: center;
  overflow: hidden;
}
@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    transform-origin: center;
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
    transform-origin: center;
  }
}
.rotating {
  -webkit-animation: rotating 10s linear infinite;
  -moz-animation: rotating 10s linear infinite;
  -ms-animation: rotating 10s linear infinite;
  -o-animation: rotating 10s linear infinite;
  animation: rotating 10s linear infinite;
}

#contents {
  height: 100%;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
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
</style>
