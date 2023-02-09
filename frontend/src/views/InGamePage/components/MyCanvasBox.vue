<template>
    <div>
    <canvas
      style="margin: 0 auto; border: 2px solid"
      width="585"
      height="328"
      id="canvas"
    ></canvas>
    <!-- <canvas
    style="margin: 0 auto; border: 2px solid"
    width="585" height="328" id="myCanvas"></canvas> -->
    <div style="margin: 1rem">
      <v-btn @click="allowDrawing">Draw</v-btn>
      <v-btn @click="eraseAll">Erase</v-btn>
      <v-btn @click="getAnswerImage">제출</v-btn>
    </div>
  </div>
</template>

<script>
import className from "!raw-loader!@/assets/model/class_names.txt" // computed()에서 바로 가져와 categorys에 바로 할당한다.

import { ref, onMounted, onUnmounted } from "vue";
import { fabric } from "fabric";
import { disposeTFVariables, TFModel } from "@/utils/model";
import { CLASS_NAMES } from "@/utils/class_names";
import { useStore } from 'vuex';
// import $axios  from 'axios';

const MY_MODEL_URL="http://localhost:5000/api/model.json";

export default {
    name: 'MyCanvasBox',
    setup() {
        const fabricCanvas = ref({});
        const store = useStore()
        const topFive = ref([])
        let mousePressed = false
        const classNames = []
        let coords = [] // 현재 그림의 좌표를 기록
        let raw_predictions = {};
        let model =null;

        const allowDrawing = function () {
            const canvas = fabricCanvas.value;
            canvas.isDrawingMode = 1;
            canvas.on("mouse:up", function () {
            // getFrame();
                mousePressed = false;
                submitCanvas();
            });
            canvas.on("mouse:down", function() {
                mousePressed = true;
            });
            canvas.on("mouse:move", function(e) {
                recordCoor(e);
            });
        }

        // 모두 지우기
        const eraseAll = function() {
            fabricCanvas.value.clear();
            raw_predictions = null;
            coords = [];
            fabricCanvas.value.backgroundColor="#FFFFFF";
        }

        const predictModel = function () {
            submitDrawing();
            // getAnswerImage();
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

            const mbb = getMinBox();
            const dpi = window.devicePixelRatio;

            const imageData = fabricCanvas.value.contextContainer.getImageData(
                mbb.min.x * dpi,
                mbb.min.y * dpi,
                (mbb.max.x - mbb.min.x) * dpi,
                (mbb.max.y - mbb.min.y) * dpi
            );

            return imageData;
        };

        const getAnswerImage = function(){
      // toDataURL()사용하여 png타입의 base64인코딩된 data url 형식의 문자열을 반환
      const canvas = fabricCanvas.value
      var dataUrl = canvas.toDataURL('image/png')
      console.log(dataUrl)

      // data:image/jpeg;base64,/9j/4AAQSkZJRg...AAAAAB//2Q==
      // data : <type> <;base64> <data>

      // <data> 부분 뽑아내기
      // atob = ASCII -> binary
      // btoa = binary -> ASCII
      // base64 데이터 디코딩
      var byteString = window.atob(dataUrl.split(',')[1]);
      var array = [];
      // i 에 해당하는 string을 unicode로 변환
      for (var i = 0; i < byteString.length; i++) {
          array.push(byteString.charCodeAt(i));
      }
      console.log("array 잘 만드냐?", array);
      // (2486) [137, 80, 78, 71, ...]
      // Blob 생성
      var myBlob = new Blob([new Uint8Array(array)], {type: 'image/png'});

      // ** Blob -> File 로 변환**
      var file = new File([myBlob], "blobtofile.png");
      var formData = new FormData();

      formData.append("answerImage", file);
      formData.append("content", "Blob확인");
      formData.append("tagList", "blob");
      formData.append("username", "admin");

      console.log("formData : ", formData.get("answerImage"));
      console.log("token : ", store.state.accountStore.token);
      const myToken=store.state.accountStore.token;
      store.dispatch('gameStore/uploadImage', formData, myToken);

        };

        const submitCanvas = function () {
            /**
             * Get image on canvas and submit it to the model for prediction
             */
            raw_predictions = model.predictClass(getImageData());
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
            topFive.value = []
            for (var i=0; i < 5 ; i++) {
                topFive.value.push((getTopClassNames()[i]))
            }
            console.log("winClass = ", winClass);
            console.log('그냥 : ', topFive)
            store.dispatch('gameStore/sendTopFive', topFive.value)
        };

        const getClassNames = function () {
            return CLASS_NAMES;
        };

        onMounted(() => {
            model=new TFModel();
            Promise.all([
                model.loadModel(MY_MODEL_URL),
            ]);

            fabricCanvas.value = new fabric.Canvas(`canvas`, {
                backgroundColor: "transparent",
                isDrawingMode: 0,
            });

            fabricCanvas.value.backgroundColor="#FFFFFF";

            const brush = fabricCanvas.value.freeDrawingBrush
            if (fabricCanvas.value.freeDrawingBrush) {
                brush.width = 5;
                brush.color = 'black'
                brush.shadow = new fabric.Shadow({
                    blur: 30,
                    offsetX: 10,
                    offsetY: 10,
                    affectStroke: false,
                    color: 'grey',
                });
            }

            success()
        })

        onUnmounted(() =>{
            disposeTFVariables();
        })



        /*
        record the current drawing coordinates
        */
        const recordCoor = (event) => {
            var pointer = fabricCanvas.value.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;

            if (posX >= 0 && posY >= 0 && mousePressed) {
                coords.push(pointer)
            }
        }

        /*
        load the class names
        */
        const success = () => {
                const lst = className.split(/\n/)
                for (var i = 0; i < lst.length - 1; i++) {
                    let symbol = lst[i]
                    classNames[i] = symbol
                    console.log(symbol)
                }
            }

        return {
            allowDrawing,
            eraseAll,
            predictModel,
            success,
            getAnswerImage

        }
    },
}
</script>
<style>
</style>