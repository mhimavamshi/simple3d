import type { Point3d } from "./geometry";

type drawCallback = (ctx: CanvasRenderingContext2D) => void;

class Screen {
    camera: Point3d;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    BACKGROUND_COLOR: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.camera = {x: 0, y: 0, z: 0};
        this.ctx = ctx;
        this.canvas = canvas;

        this.BACKGROUND_COLOR = "black";
        // this.movespeed = 15;
    }

    draw(worldCallBack: drawCallback, screenCallBack: drawCallback) {
        this.switchToWorld();
        worldCallBack(this.ctx);
        this.switchToScreen();
        screenCallBack(this.ctx);
    }

    clear() {
        this.ctx.fillStyle = this.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    switchToWorld() {
        this.clear();
        this.ctx.save();
        this.ctx.translate(
            this.canvas.width / 2 - this.camera.x,
            this.canvas.height / 2 - this.camera.y
        );
    }

    switchToScreen() {
        this.ctx.restore();
    }

//    handleKey(event) {
//        if (event.key === "ArrowUp") this.camera.y -= this.movespeed;
//        if (event.key === "ArrowDown") this.camera.y += this.movespeed;
//        if (event.key === "ArrowLeft") this.camera.x -= this.movespeed;
//        if (event.key === "ArrowRight") this.camera.x += this.movespeed;
//    }

//    registerEvents(eventregistry) {
//        eventregistry.register({
//            keyDown: (event) => this.handleKey(event)
//        });
//    }

}

export { Screen };
