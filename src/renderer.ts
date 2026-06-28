import { RenderData } from "./geometry";    

class FrameBuffer {
    width: number;
    height: number;
    buffer: Array<string>;
    DEFAULT_COLOR: string;

    constructor(width: number, height: number, ) {
        this.width = width;
        this.height = height;
        this.DEFAULT_COLOR = "black";
        this.buffer = Array(this.width * this.height).fill(this.DEFAULT_COLOR);
    }

    clear() {
        this.buffer.fill(this.DEFAULT_COLOR);
    }

    inBounds(ix: number, iy: number): boolean {
        return (
            ix >= 0 &&
            ix < this.width &&
            iy >= 0 &&
            iy < this.height
        );
    }

    set(x: number, y: number, color: string) {
        const ix = Math.round(x + this.width/2);
        const iy = Math.round(this.height/2 - y);
        if(this.inBounds(ix, iy)) {   
            this.buffer[iy * this.width + ix] = color;
        }
    }

    // will implement [R, G, B, A ...] expansion here
    flatten(): Uint8ClampedArray {
        return new Uint8ClampedArray();
    }

}


class Renderer {
    buffer: FrameBuffer;

    constructor(width: number, height: number) {
        this.buffer = new FrameBuffer(width, height);
    }

    render(): Uint8ClampedArray {

    }
}

export { FrameBuffer, Renderer };