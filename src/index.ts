import { Screen } from "./screen";
import { SObject, ObjectManager } from "./object";   
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

const cube = new SObject({x: 10, y: 10, z: 30}, {vertices: [{x: 1, y: 1, z: 100}], triangles: [{a: 0, b: 0, c: 0}]}); // its wrong but you get the point
objectmanager.add("cube", cube);


function loop(ctx: CanvasRenderingContext2D, delta: number) {

}

const screen = new Screen(canvas, ctx);
screen.onFrame(loop);
screen.render();

