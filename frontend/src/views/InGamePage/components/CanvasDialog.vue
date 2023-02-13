<template>
  <div class="wrap-dialog">
  <div class="dialog">
    <div class="tit-dialog">정답자</div>
      <canvas class="canvas"
      width="600"
      height="300"
      id="aCanvas"></canvas>
      <div>
        <button class="modal-default-button" @click="imageToCanvas">
          pull
          </button>
          <br/>
          <button class="modal-default-button" @click="closeModal">
            close
          </button>
      </div>
  </div>
</div>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";
//import $axios from "axios";
//$axios.defaults.headers.post["Content-Type"] = "application/json";

export default {
  name : 'CanvasDialog',
  components: {
    // RotateSquare2
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    
    const closeModal= function(){
      store.dispatch("gameStore/answerImageOn", false); 
    };
    onMounted(()=>{
      imageToCanvas();
    });
    const imageToCanvas= async function(){
        const getFile =await store.dispatch("gameStore/downloadImage");
        console.log("getFile 찍자");
        console.log(getFile);
        
        var myCanvas=document.getElementById('aCanvas');
        var ctx = myCanvas.getContext('2d');
        var img = new Image;
        img.src = getFile;
        img.onload = function(){
          ctx.drawImage(img,0,0); // Or at whatever offset you like
          };
    };
    
    
    return {
      router,
      closeModal,
      imageToCanvas,
    };
  },
};
</script>

<style scoped>
.dialog {
  height: 100%;
  max-height: 500px;
  width: 500px;
}
.btn-dialog {
  background: #24CB83;
  color: #FFFFFF;
}
.canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}
.tit-dialog{
  position: relative;
}
</style>