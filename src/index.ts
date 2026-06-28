import { Screen } from "./screen";
import { Pipeline } from "./pipeline";
import { SObject, ObjectManager } from "./object";   
import { ObjectTransforms } from "./objectTransforms";  
import { Renderer } from "./renderer";  
import { Camera3D } from "./camera";    
import { EventManager, type EventInput, type EventHandler } from "./events";    
import { assertNonNull } from "./utils";


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

// const cube = new SObject({x: 10, y: 10, z: 30}, {vertices: [{x: 1, y: 1, z: 100}], triangles: [{a: 0, b: 0, c: 0}]}); // its wrong but you get the point
// objectmanager.add("cube", cube);

function loop(delta: number) {
    eventmanager.dispatch();
    // any physics updates handling the objects, that might use delta
    // for now just object transforms
    // objectmanager.applyToAll(ObjectTransforms.rotate);
    let renderdata = pipeline.in(objectmanager, camera);
    const imagedata = renderer.render(renderdata);
    // function that puts image data on the screen
}   

const screen = new Screen(canvas, ctx);
screen.onFrame(loop);
screen.render();

