enum EventType {
    KEYDOWN = "keydown",
    KEYUP = "keyup",
    MOUSECLICK = "mouseclick"
}

type EventPayload = Record<string, string | number | number[]>;;

// a structured event
interface SEvent {
    type: EventType, 
    payload: EventPayload
}

type EventInput = Map<EventType, Array<SEvent>>;

interface EventHandler {
    handleEvent: (arg: EventInput) => void;
}

interface BrowserTargets {
    canvas: HTMLCanvasElement
}

class EventManager {
    handlers: Set<EventHandler>
    buffer: EventInput  

    // we will need targets, onclicks or events to gather events
    constructor() {
        this.handlers = new Set();
        this.buffer = new Map();
        this.initBuffer();
    }

    register (handler: EventHandler) {
        this.handlers.add(handler);
    }

    emit(event: SEvent) {
        let buff = this.buffer.get(event.type);
        if(buff === undefined) {
            return;
        }
        buff.push(event);
    }

    hookToBrowser(targets: BrowserTargets) {
        targets.canvas.addEventListener("click", (event) => {
            const rect = targets.canvas.getBoundingClientRect();

            const canvasX = event.clientX - rect.left;
            const canvasY = event.clientY - rect.top;

            const translatedX = canvasX - (targets.canvas.width / 2);
            const translatedY = canvasY - (targets.canvas.height / 2);

            const sevent: SEvent = {type: EventType.MOUSECLICK, payload: { x: translatedX, y: translatedY }};
            this.emit(sevent);
        });
    }
    
    initBuffer() {
        for(let event of Object.values(EventType)) {
            this.buffer.set(event, []);
        }
    }

    dispatch() {
        let immutableBuffer = this.buffer;

        this.buffer = new Map(); 
        this.initBuffer();

        for(const handler of this.handlers) {
            handler.handleEvent(immutableBuffer); // handlers must use this.emit and write to immutable buffer
        }
    }
}