<template>
    <div>
    <canvas
      style="margin: 0 auto; border: 2px solid"
      width="585"
      height="328"
      id="canvas"
    ></canvas>
    <div style="margin: 1rem">
      <v-btn @click="allowDrawing">Draw</v-btn>
      <v-btn @click="eraseAll">Erase</v-btn>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { fabric } from "fabric";

export default {
    name: 'MyCanvasBox',
    setup() {
        const fabricCanvas = ref({});
        let mousePressed = false;
        let coords = []; // 현재 그림의 좌표를 기록


        const recordCoor = function (event) {
            var pointer = fabricCanvas.value.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;

            if (posX >= 0 && posY >= 0 && mousePressed) {
                coords.push(pointer)
            }
        }

        const allowDrawing = function () {
            const canvas = fabricCanvas.value;
            canvas.isDrawingMode = 1;
            canvas.on("mouse:up", function () {
            // getFrame();
                mousePressed = false
                console.log("mouse:up")
            });
            canvas.on("mouse:down", function() {
                mousePressed = true
                console.log("mouse:down")
            });
            canvas.on("mouse:move", function(e) {
                recordCoor(e)
                console.log("mouse:move")
            });
        }

        // 모두 지우기
        const eraseAll = function() {
            fabricCanvas.value.clear();
            coords = [];
        }

        onMounted(() => {
            fabricCanvas.value = new fabric.Canvas(`canvas`, {
                backgroundColor: "transparent",
                isDrawingMode: 0,
            });
            const brush = fabricCanvas.value.freeDrawingBrush
            if (fabricCanvas.value.freeDrawingBrush) {
                brush.width = 10;
                brush.color = 'black'
                brush.shadow = new fabric.Shadow({
                    blur: 30,
                    offsetX: 10,
                    offsetY: 10,
                    affectStroke: false,
                    color: 'grey',
                });
                }
        })
        return {
            recordCoor,
            allowDrawing,
            eraseAll,
        }
    },
}
</script>
<style>
</style>