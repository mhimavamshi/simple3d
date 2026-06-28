import { type RenderData } from "./geometry";    
import { assertNonNull } from "./utils";

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
    // zbuffer lets make a z buffer class    

    constructor(width: number, height: number) {
        this.buffer = new FrameBuffer(width, height);
    }

    // edge functions here!
    rasterizeTriangle(data: RenderData) {
        for(const [index, triangle] of data.triangles.entries()) {
            const a = data.vertices[triangle.a];
            const b = data.vertices[triangle.b];
            const c = data.vertices[triangle.c];
            assertNonNull(a);
            assertNonNull(b);
            assertNonNull(c);       
            
            // now we have triangles :P 
            // edge function to rasterize
            // and z value buffer, for draw or not
            //....after dinner
        }
    }



    render(data: Array<RenderData>): Uint8ClampedArray {
        this.buffer.clear();
        for(const unit of data) {
            this.rasterizeTriangle(unit);
        }
        return this.buffer.flatten();
    }
}

export { FrameBuffer, Renderer };