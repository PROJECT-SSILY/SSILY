<template>
  <div class="canvas_container">
    <button @click="predictModel" id="submit">제출하기</button>
    <div class="group_button">
      <div id="brush" @click="allowDrawing">
        <v-img src="@/assets/canvas/brush.svg" alt="brush"/>
      </div>
      <div id="eraser" @click="eraseAll">
        <v-img src="@/assets/canvas/eraser.svg" alt="eraser"/>
      </div>
    </div>
    <canvas
        width="650"
        height="400"
        id="canvas"
    >
    <!-- 수정 전:  560 * 330 -->
    </canvas>
    <v-alert
      v-if="state.alertFlag"
      type="error"
      text="틀렸습니다!"
    ></v-alert>
    <div id="toast"></div>
  </div>
</template>

<script>
import className from "!raw-loader!@/assets/model/class_names.txt"; // computed()에서 바로 가져와 categorys에 바로 할당한다.
import { reactive } from '@vue/reactivity'
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { fabric } from "fabric";
import { disposeTFVariables, TFModel } from "@/utils/model";
import { CLASS_NAMES } from "@/utils/class_names";
import { useStore } from "vuex";
//import CanvasDialog from './CanvasDialog.vue';
// import $axios  from 'axios';

const MY_MODEL_URL = "http://localhost:5500/api/model.json";

export default{
  name: "MyCanvasBox",
  //components: { CanvasDialog },
  setup() {
    const store = useStore();
    const answerOn = computed(() =>{
    return store.state.gameStore.answerOn});
    const answer= computed(() => {
      return store.state.gameStore.answer});
    const endRound = computed(() => store.state.gameStore.endRound);
    const preventSubmit = computed(() => store.getters["gameStore/getPreventSubmit"]);
    watch(endRound, (newValue) => {
       if (newValue) {
        eraseAll();
       }
    });
    const fabricCanvas = ref({});
    const topFive = ref([]);
    let mousePressed = false;
    const classNames = [];
    let coords = []; // 현재 그림의 좌표를 기록
    let raw_predictions = {};
    let model = null;
    const state = reactive({
      alertFlag: false,
    })
    let submitPossible = true;
    let removeToast = null;
    const allowDrawing = function () {
      const canvas = fabricCanvas.value;
      canvas.isDrawingMode = 1;
      canvas.on("mouse:up", function () {
        // getFrame();
        mousePressed = false;
        // submitCanvas();
      });
      canvas.on("mouse:down", function () {
        mousePressed = true;
      });
      canvas.on("mouse:move", function (e) {
        recordCoor(e);
      });
    };

    const toast = function(string) {
      const toast = document.getElementById("toast");

      toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
          document.getElementById("toast").classList.remove("reveal")
      }, 1000)) :
      removeToast = setTimeout(function () {
          document.getElementById("toast").classList.remove("reveal")
      }, 1000)
      toast.classList.add("reveal"),
      toast.innerText = string
    }

    // 모두 지우기
    const eraseAll = function () {
      fabricCanvas.value.clear();
      raw_predictions = null;
      coords = [];
      // fabricCanvas.value.backgroundColor = "rgba(81, 255, 255, 0.2)";
      fabricCanvas.value.backgroundColor = "rgba(81, 255, 255, 0.2)";
    };

    const predictModel = async function () {
      let temp = store.state.gameStore.preventSubmit
      if (temp) {
        return
      }
      if(!submitPossible) {
        toast("3초 후에 다시 제출할 수 있습니다!");
        return;
      } else { //제출
        setTimeout(() => submitPossible=true, 3000);
        submitPossible=false;
        await submitCanvas();
        await submitDrawing();
      }
    };

    const getMinBox = function () {
      /**
       * Get top left and bottom right coords of bounding box of the drawing
       */
      var coorX = coords.map(function (p) {
        return p.x;
      });

      var coorY = coords.map(function (p) {
        return p.y;
      });

      var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY),
      };

      var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY),
      };

      return {
        min: min_coords,
        max: max_coords,
      };
    };

    const getImageData = function () {
      /**
       * Get image data in canvas
       */

      
      // fabricCanvas.value.setBackgroundColor("#FFFFFF")
      // fabricCanvas.value.renderAll()
      try{
        const mbb = getMinBox();
        const dpi = window.devicePixelRatio;

        // console.log("mbb = {}", mbb);
        // console.log("mbb.max = {}", mbb.max);
        let max = mbb.max;
        let min = mbb.min;

        if(max.x == Infinity || max.x == -Infinity || max.y == Infinity || max.y == -Infinity) return null;
        if(min.x == Infinity || min.x == -Infinity || min.y == Infinity || min.y == -Infinity) return null;


        fabricCanvas.value.setBackgroundColor("#FFFFFF", fabricCanvas.value.renderAll.bind(fabricCanvas.value))
        // const object = fabricCanvas.value.getActiveObject();
        // object.setBackgroundColor("#FFFFFF", fabricCanvas.value.renderAll.bind(fabricCanvas.value))
        
        // fabricCanvas.value.stroke.setFill('black', fabricCanvas.value.renderAll.bind(fabricCanvas.value));
        // fabricCanvas.value.getActiveObject().stroke.color = "black";
        // fabricCanvas.value.renderAll();

        const imageData = fabricCanvas.value.contextContainer.getImageData(
          mbb.min.x * dpi,
          mbb.min.y * dpi,
          (mbb.max.x - mbb.min.x) * dpi,
          (mbb.max.y - mbb.min.y) * dpi
        );

        // const imageData = fabricCanvas.value.contextContainer.getImageData(0, 0, fabricCanvas.value.width, fabricCanvas.value.height);
        const data = imageData.data
        for (var i = 0; i < data.length; i+= 4) {
          if (data[i]!=255 || data[i+1]!=255 || data[i+2]!=255) {
            // console.log("DDDD")
            data[i] = 0; // Red
            data[i+1] = 0; // Green
            data[i+2] = 0; // Blue
          }
        }

        fabricCanvas.value.setBackgroundColor("rgba(81, 255, 255, 0.2)", fabricCanvas.value.renderAll.bind(fabricCanvas.value))

        return imageData;
      } catch(err){
        console.log("err = ", err);
        return null;
      }

    };

      const canvasToImage = async function(){
      // toDataURL()사용하여 png타입의 base64인코딩된 data url 형식의 문자열을 반환
      fabricCanvas.value.setBackgroundColor("#FFFFFF", fabricCanvas.value.renderAll.bind(fabricCanvas.value))
      const canvas = fabricCanvas.value;
      var dataUrl = await canvas.toDataURL("image/png");
      store.dispatch("gameStore/changeImageURL", dataUrl);
      // console.log(dataUrl);
      fabricCanvas.value.setBackgroundColor("rgba(81, 255, 255, 0.2)", fabricCanvas.value.renderAll.bind(fabricCanvas.value))
      // data:image/jpeg;base64,/9j/4AAQSkZJRg...AAAAAB//2Q==
      // data : <type> <;base64> <data>
      // <data> 부분 뽑아내기
      // atob = ASCII -> binary
      // btoa = binary -> ASCII
      // base64 데이터 디코딩
      var byteString = window.atob(dataUrl.split(",")[1]);
      var array = [];
      // i 에 해당하는 string을 unicode로 변환
      for (var i = 0; i < byteString.length; i++) {
        array.push(byteString.charCodeAt(i));
      }
      //console.log("array 잘 만드냐?", array);
      // (2486) [137, 80, 78, 71, ...]
      // Blob 생성
      var myBlob = new Blob([new Uint8Array(array)], { type: "image/png" });
      console.log("myBlob is ==>", myBlob);

      // Blob -> File 로 변환
      var file = new File([myBlob], "blobtofile.png");
      var formData = new FormData();

      await formData.append("answerImage", file);
      formData.append("content", "Blob확인");
      formData.append("tagList", "blob");
      formData.append("username", "admin");
      console.log("formData : ", formData.get("answerImage"));
      console.log("token : ", store.state.accountStore.token);
      //const myToken = store.state.accountStore.token;
      await store.dispatch("gameStore/saveMyFormData", formData);
    };

    const submitCanvas = function () {
      /**
       * Get image on canvas and submit it to the model for prediction
       */
      let imageData = getImageData();
      try{
        raw_predictions = model.predictClass(imageData);
      } catch{
        raw_predictions = [];
      }
      // if(imageData == null) raw_predictions = [];
      // else raw_predictions = model.predictClass(imageData);
    };

    const findIndicesOfMax = function () {
      /**
       * Get indices of 5 classes with highest predicted probabilities
       */
      var outp = [];
      for (let i = 0; i < raw_predictions.length; i++) {
        outp.push(i);
        if (outp.length > 5) {
          let pred = raw_predictions;
          outp.sort(function (a, b) {
            return pred[b] - pred[a];
          });
          outp.pop();
        }
      }
      return outp;
    };

    const getTopClassNames = function () {
      /**
       * Find classes for highest predicted indices from findIndicesOfMax
       */
      let outp = [];
      let indices = findIndicesOfMax();

      for (let i = 0; i < indices.length; i++) {
        outp[i] = getClassNames()[indices[i]];
      }
      return outp;
    };

    const submitDrawing = function () {
      const winClass = getTopClassNames()[0];
      topFive.value = [];
      for (var i = 0; i < 5; i++) {
        topFive.value.push(getTopClassNames()[i]);
        console.log('getTopClassNames()[i] => ', i ,getTopClassNames()[i])
      }
      console.log('getTopClassNames = ',getTopClassNames())
      console.log("winClass = ", winClass);
      store.dispatch("gameStore/sendTopFive", topFive.value)
      setTimeout(function() {
        if (endRound.value == false) {
          toast('틀렸습니다!')
        }
        }, 300);
      // setTimeout(function() {
      // if (state.alertFlag == true) {
      //   state.alertFlag = false}
      // }, 1200);
      canvasToImage();
    };

    const getClassNames = function () {
      return CLASS_NAMES;
    };

    onMounted(() => {
      model = new TFModel();
      Promise.all([model.loadModel(MY_MODEL_URL)]);

      fabricCanvas.value = new fabric.Canvas(`canvas`, {
        backgroundColor: "rgba(81, 255, 255, 0.2)",
        isDrawingMode: 0,
      });
      allowDrawing()
      // fabricCanvas.value.backgroundColor = "rgba(81, 255, 255, 0.2)";
      // fabricCanvas.value.backgroundColor = "rgba(81, 255, 255, 0.2)";

      const brush = fabricCanvas.value.freeDrawingBrush;
      if (fabricCanvas.value.freeDrawingBrush) {
        // brush.width = 15;
        // brush.color = "#AEFFFF";
        // brush.shadow = new fabric.Shadow({
        //   blur: 30,
        //   offsetX: 0,
        //   offsetY: 0,
        //   affectStroke: false,
        //   color: "#51FFFF",
        brush.width = 10;
        brush.color = "#AEFFFF";
        // brush.color = "black";
        // brush.shadow = new fabric.Shadow({
        //   blur: 30,
        //   offsetX: 10,
        //   offsetY: 10,
        //   affectStroke: false,
        //   color: "grey",
        // });
      }

      success();
    });

    onUnmounted(() => {
      disposeTFVariables();
    });

    /*
        record the current drawing coordinates
        */
    const recordCoor = (event) => {
      var pointer = fabricCanvas.value.getPointer(event.e);
      var posX = pointer.x;
      var posY = pointer.y;

      if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer);
      }
    };

    /*
        load the class names
        */
    const success = () => {
      const lst = className.split(/\n/);
      for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i];
        classNames[i] = symbol;
        console.log(symbol);
      }
    };

    return {
      preventSubmit,
      allowDrawing,
      eraseAll,
      answerOn,
      answer,
      predictModel,
      success,
      canvasToImage,
      endRound,
      state,
      submitPossible,
      removeToast,
      toast,
    };
  },
};
</script>
<style scoped>
.canvas_container {
    position: relative;
}

#canvas, .upper-canvas {
    /*border-radius: 55px; */
    /* position: inherit; */
    border-radius: 20px;
    border: 1px solid rgba(81, 255, 255, 0.6);
    box-shadow: 0 0 20px 3px rgba(81, 255, 255, 0.5);
}
#submit {
  background: rgb(255, 255, 255, 0.1); 
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 10px 20px; 
  position: absolute; 
  z-index: 100; 
  color: rgba(240, 248, 255, 0.699);
  bottom: 0;
  right: 0;
  font-size: 18px;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 600;
}
/* left : 490  */
#submit:hover {
  background: rgba(255, 255, 255, 0.2);
/* background: rgb(227, 227, 227); */
}
.group_button {
  width: 45px;
  height: 90px;
  position: absolute;
  margin-top: -50px;
  margin-left: 10px;
  top: 50%;
  right: 10px;
  z-index: 100;
  /*border-radius: 15px;*/
  /*box-shadow: 0px 0px 20px 0px #0000003b*/
}

#brush, #eraser {
  width: 45px;
  height: 45px;
  padding: 10px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  /*background: white;*/
}
#brush {
    border-radius: 30px 30px 0 0;
}
#eraser {
    border-radius: 0 0 30px 30px;
  /*border-radius: 0 0 15px 15px;*/
}
#brush:hover, #eraser:hover {
    background: rgba(255, 255, 255, 0.2);
  /* background: rgb(227, 227, 227); */
}
#brush:active, #eraser:active {
    background: rgba(255, 255, 255, 0.2);
  /* background: rgb(195, 195, 195); */
}

#toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    padding: 15px 20px;
    transform: translate(-50%, 10px);
    border-radius: 30px;
    overflow: hidden;
    font-size: .8rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity .5s, visibility .5s, transform .5s;
    background: rgba(0, 0, 0, .35);
    color: #fff;
    z-index: 10000;
}

#toast.reveal {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0)
}
</style>
