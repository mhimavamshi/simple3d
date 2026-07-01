import { Screen } from "./screen";
import { Pipeline } from "./pipeline";
import { SObject, ObjectManager } from "./object";   
import * as ObjectTransforms from "./objectTransforms" ;  
import { Renderer } from "./renderer";  
import { Camera3D } from "./camera";    
import { EventManager, type EventInput, type EventHandler } from "./events";    
import { assertNonNull } from "./utils";
import type { Mesh } from "./geometry";
import { loadOBJ } from "./fileformats";


const canvas = document.querySelector<HTMLCanvasElement>("#worldCanvas");
assertNonNull(canvas);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const ctx = canvas.getContext("2d");
assertNonNull(ctx);

const objectmanager = new ObjectManager();
const eventmanager = new EventManager();
const camera = new Camera3D(WIDTH, HEIGHT);
const pipeline = new Pipeline();
const renderer = new Renderer(WIDTH, HEIGHT);

eventmanager.hookToBrowser({canvas: canvas});

class EchoHandler implements EventHandler {
    handleEvent(events: EventInput) {
        for (const [type, eventList] of events) {
            if (eventList.length === 0) continue;

            console.group(type);

            for (const event of eventList) {
                console.log(event.payload);
            }

            console.groupEnd();
        }
    }
}
const echoevents = new EchoHandler();

eventmanager.register(echoevents);

// const objText = await fetch("cow-nonormals.obj").then(r => r.text());

// const mesh = loadOBJ(objText);
// for (const v of mesh.vertices) {
//     v.x *= 50;
//     v.y *= 50;
//     // v.z *= 2;
// }

const triangle: Mesh = {
    vertices: [
        { x: 100, y: 100, z: 0 },
        { x: 180, y: 100, z: 0 },
        { x: 100, y: 180, z: 0 },
    ],
    triangles: [
        { a: 0, b: 1, c: 2 },
    ],
};

objectmanager.add(
    "triangle",
    new SObject({ x: 0, y: 0, z: 10 }, triangle)
);

// objectmanager.add(
//     "obj2",
//     new SObject({ x: 100, y: 500, z: 2 }, mesh)
// );

// objectmanager.add(
//     "obj3",
//     new SObject({ x: 500, y: 500, z: 3 }, mesh)
// );

// objectmanager.add(
//     "obj4",
//     new SObject({ x: 700, y: 0, z: 4 }, mesh)
// );

camera.pos = {
    x: 0,
    y: 0,
    z: 0,
};

const imagedata = new ImageData(WIDTH, HEIGHT);

function display(ctx: CanvasRenderingContext2D, pixels: Uint8ClampedArray<ArrayBuffer>) {
    imagedata.data.set(pixels);
    ctx.putImageData(imagedata, 0, 0);
}

const angularSpeed = Math.PI / 8; // 5.625°/s

function loop(ctx: CanvasRenderingContext2D, delta: number) {
    eventmanager.dispatch();
    objectmanager.applyToAll(ObjectTransforms.rotateX, {delta, angularSpeed}); 
    let renderdata = pipeline.in(objectmanager, camera);
    const pixels = renderer.render(renderdata) as Uint8ClampedArray<ArrayBuffer>;
    display(ctx, pixels);
}   

const screen = new Screen(canvas, ctx);
screen.onFrame(loop);
screen.render();

