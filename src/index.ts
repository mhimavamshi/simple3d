import { Screen } from "./screen";
import { assertNonNull } from "./utils";

const canvas = document.querySelector<HTMLCanvasElement>("#worldCanvas");
assertNonNull(canvas);

const ctx = canvas.getContext("2d");
assertNonNull(ctx);

const screen = new Screen(canvas, ctx);

function drawWorld(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#11111b"; 
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = "#a6e3a1"; 
    ctx.fillRect(50, 50, 100, 100);
}

function drawUI(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#cdd6f4";
    ctx.font = "20px sans-serif";
    ctx.fillText("Score: 0000", 20, 40);
}


function loop() {
    screen.draw(drawWorld, drawUI);

    requestAnimationFrame(loop);
}

loop();
