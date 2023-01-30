<template>
    <div>
    <canvas
      style="margin: 0 auto; border: 2px solid"
      width="585"
      height="328"
      id="canvas"
    ></canvas>
    <div style="margin: 1rem">
      <button @click="drawPolygon">Draw</button>
      <button @click="showPolygon">Show</button>
      <button @click="editPolygon">Edit</button>
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

        const drawPolygon = () => {
        const fc = fabricCanvas.value;
        const isDown = {
            current: false,
        };
        const prevCordsRef = {
            current: {
            x2: 0,
            y2: 0,
            },
        };
        const line = {
            current: null,
        };
        const vertices = {
            current: [],
        };

        const addVertice = (newPoint) => {
            if (vertices.current.length > 0) {
            const lastPoint = vertices.current[vertices.current.length - 1];
            if (lastPoint.x !== newPoint.x && lastPoint.y !== newPoint.y) {
                vertices.current.push(newPoint);
            }
            } else {
            vertices.current.push(newPoint);
            }
        };

        fc.on("mouse:down", function (o) {
            isDown.current = true;
            const pointer = fc.getPointer(o.e);

            let points = [pointer.x, pointer.y, pointer.x, pointer.y];

            if (
            prevCordsRef.current &&
            prevCordsRef.current.x2 &&
            prevCordsRef.current.y2
            ) {
            const prevX = prevCordsRef.current.x2;
            const prevY = prevCordsRef.current.y2;
            points = [prevX, prevY, prevX, prevY];
            }

            const newPoint = {
            x: points[0],
            y: points[1],
            };
            addVertice(newPoint);

            line.current = new fabric.Line(points, {
            strokeWidth: 2,
            fill: "black",
            stroke: "black",
            originX: "center",
            originY: "center",
            });

            fc.add(line.current);
        });

        fc.on("mouse:move", function (o) {
            if (!isDown.current) return;
            const pointer = fc.getPointer(o.e);
            const coords = {
            x2: pointer.x,
            y2: pointer.y,
            };
            line.current.set(coords);
            prevCordsRef.current = coords;
            fc.renderAll();
        });

        fc.on("mouse:up", function (o) {
            isDown.current = false;

            const pointer = fc.getPointer(o.e);

            const newPoint = {
            x: pointer.x,
            y: pointer.y,
            };
            addVertice(newPoint);
        });
        };
        const showPolygon = () => {};
        const editPolygon = () => {};

        onMounted(() => {
        fabric.Object.prototype = {
            ...fabric.Object.prototype,
            transparentCorners: false,
            cornerStyle: "circle",
            cornerSize: 5,
        };

        fabricCanvas.value = new fabric.Canvas(`canvas`, {
            backgroundColor: "transparent",
            selection: false,
            renderOnAddRemove: true,
        });
        });

        return {
        drawPolygon,
        showPolygon,
        editPolygon,
        };
    },
}
</script>
<style>
</style>