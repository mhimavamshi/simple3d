type loopCallback = (ctx: CanvasRenderingContext2D, delta: number) => void;

class Screen {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    loop: loopCallback;
    lastTime: number;
    BACKGROUND_COLOR: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.loop = ()=>{};
        this.lastTime = 0;
        this.BACKGROUND_COLOR = "#000000";
    }

    onFrame(loop: loopCallback) {
        this.loop = loop;
    }

    render() {
        requestAnimationFrame(this.renderLoop);
    }
 
    clearScreen() {
        this.ctx.fillStyle = this.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderLoop = (currentTime: number) => {
        this.clearScreen();
        if (!this.lastTime) {
            this.lastTime = currentTime;
            requestAnimationFrame(this.renderLoop);
            return; 
        }
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime; 
        this.loop(this.ctx, delta);
        requestAnimationFrame(this.renderLoop);
    }

}

export { Screen };
