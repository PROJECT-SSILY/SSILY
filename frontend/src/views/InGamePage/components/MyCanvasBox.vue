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
import className from "!raw-loader!@/assets/model/class_names.txt" // computed()에서 바로 가져와 categorys에 바로 할당한다.

import { ref, onMounted } from "vue";
import { fabric } from "fabric";

export default {
    name: 'MyCanvasBox',
    setup() {
        const fabricCanvas = ref({});

        // let model
        // let mode
        let mousePressed = false
        const classNames = []
        let coords = [] // 현재 그림의 좌표를 기록

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

            success()
        })

        // 후 처리


        // const setTable = (top5, probs) => {
        //     //loop over the predictions
        //     for (var i = 0; i < top5.length; i++) {
        //         let sym = document.getElementById('sym' + (i + 1))
        //         let prob = document.getElementById('prob' + (i + 1))
        //         sym.innerHTML = top5[i]
        //         prob.innerHTML = Math.round(probs[i] * 100)
        //     }
        //     // //create the pie
        //     // createPie(".pieID.legend", ".pieID.pie");

        // }

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

        //     /*
        //     get the best bounding box by trimming around the drawing
        //     */
        // const getMinBox = () => {
        //         //get coordinates
        //         var coorX = coords.map(function(p) {
        //             return p.x
        //         });
        //         var coorY = coords.map(function(p) {
        //             return p.y
        //         });

        //         //find top left and bottom right corners
        //         var min_coords = {
        //             x: Math.min.apply(null, coorX),
        //             y: Math.min.apply(null, coorY)
        //         }
        //         var max_coords = {
        //             x: Math.max.apply(null, coorX),
        //             y: Math.max.apply(null, coorY)
        //         }

        //         //return as strucut
        //         return {
        //             min: min_coords,
        //             max: max_coords
        //         }
        //     }

        //     /*
        //     get the current image data
        //     */
        // const getImageData = () => {
        //             //get the minimum bounding box around the drawing
        //             const mbb = getMinBox()

        //             //get image data according to dpi
        //             const dpi = window.devicePixelRatio
        //             const imgData = fabricCanvas.value.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
        //                                                         (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        //             return imgData
        //         }

        //     /*
        //     get the prediction
        //     */
        // const getFrame = () => {
        //         //make sure we have at least two recorded coordinates
        //         if (coords.length >= 2) {

        //             //get the image data from the canvas
        //             const imgData = getImageData()

        //             //get the prediction
        //             const pred = model.predict(preprocess(imgData)).dataSync()

        //             //find the top 5 predictions
        //             const indices = findIndicesOfMax(pred, 5) // 상위 5개까지만 확인
        //             const probs = findTopValues(pred, 5) // 상위 5개까지만 확인
        //             const names = getClassNames(indices)

        //             //set the table
        //             setTable(names, probs)
        //         }

        //     }

        //     /*
        //     get the the class names
        //     */
        // const getClassNames = (indices) => {
        //         var outp = []
        //         for (var i = 0; i < indices.length; i++)
        //             outp[i] = classNames[indices[i]]
        //         return outp
        //     }

        //     /*
        //     load the class names
        //     */
        // const loadDict = async () => {
        //     new Promise((resolve, reject) => {
        //         return className
        //     }).then(() => {
                
        //     }).catch((err) => {
        //         throw err
        //     })
        //     }

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

        //     /*
        //     get indices of the top probs
        //     */
        // const findIndicesOfMax = (inp, count) => {
        //         var outp = [];
        //         for (var i = 0; i < inp.length; i++) {
        //             outp.push(i); // add index to output array
        //             if (outp.length > count) {
        //                 outp.sort(function(a, b) {
        //                     return inp[b] - inp[a];
        //                 }); // descending sort the output array
        //                 outp.pop(); // remove the last index (index of smallest element in output array)
        //             }
        //         }
        //         return outp;
        //     }

        //     /*
        //     find the top 5 predictions
        //     */
        // const findTopValues = (inp, count) => {
        //         var outp = [];
        //         let indices = findIndicesOfMax(inp, count)
        //         // show 5 greatest scores
        //         for (var i = 0; i < indices.length; i++)
        //             outp[i] = inp[indices[i]]
        //         return outp
        //     }

        //     /*
        //     preprocess the data
        //     */
        // const preprocess = (imgData) => {
        //         return tf.tidy(() => {
        //             //convert to a tensor
        //             let tensor = tf.browser.fromPixels(imgData, numChannels = 1)

        //             //resize
        //             const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()

        //             //normalize
        //             const offset = tf.scalar(255.0);
        //             const normalized = tf.scalar(1.0).sub(resized.div(offset));

        //             //We add a dimension to get a batch shape
        //             const batched = normalized.expandDims(0)
        //             return batched
        //         })
        //     }

        //     /*
        //     load the model
        //     */
        // const start = async (cur_mode) => {
        //         //arabic or english
        //         mode = cur_mode

        //         //load the model
        //         model = await tf.loadLayersModel('model/model.json')

        //         //warm up
        //         model.predict(tf.zeros([1, 28, 28, 1]))

        //         //allow drawing on the canvas
        //         allowDrawing()

        //         //load the class names
        //         await loadDict()
        //     }


        return {
            allowDrawing,
            eraseAll,
            // setTable,
            // recordCoor,
            // getMinBox,
            // getImageData,
            // getFrame,
            // getClassNames,
            // loadDict,
            success,
            // findIndicesOfMax,
            // findTopValues,
            // preprocess,
            // start
        }
    },
}
</script>
<style>
</style>