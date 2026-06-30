import { type Point2d, type RenderData } from "./geometry";    
import { subtract2D, subtractVertex } from "./mathutils";
import { assertNonNull, renderVertexTo2d } from "./utils";

class FrameBuffer {
    width: number;
    height: number;
    buffer: Array<string>;
    DEFAULT_COLOR: string;

    constructor(width: number, height: number, ) {
        this.width = width;
        this.height = height;
        this.DEFAULT_COLOR = "#000000";
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
        const ix = Math.round(x + this.width / 2);
        const iy = Math.round(this.height / 2 - y);
        if(this.inBounds(ix, iy)) {   
            this.buffer[iy * this.width + ix] = color;
        }
    }

    flatten(): Uint8ClampedArray {
        const data = new Uint8ClampedArray(this.width * this.height * 4);

        for (let i = 0; i < this.buffer.length; i++) {
            const color = this.buffer[i];
            assertNonNull(color);

            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            const offset = i * 4;
            data[offset] = r;
            data[offset + 1] = g;
            data[offset + 2] = b;
            data[offset + 3] = 255;
        }

        return data;
    }

}

class ZBuffer {
    width: number;
    height: number;
    buffer: Array<number>;
    DEFAULT_DEPTH: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.DEFAULT_DEPTH = Infinity;
        this.buffer = Array(this.width * this.height).fill(this.DEFAULT_DEPTH);
    }

    clear() {
        this.buffer.fill(this.DEFAULT_DEPTH);
    }

    private inBounds(ix: number, iy: number): boolean {
        return (
            ix >= 0 &&
            ix < this.width &&
            iy >= 0 &&
            iy < this.height
        );
    }

    testAndSet(x: number, y: number, depth: number): boolean {
        const ix = Math.round(x + this.width / 2);
        const iy = Math.round(this.height / 2 - y);

        if (!this.inBounds(ix, iy)) {
            return false;
        }

        const index = iy * this.width + ix;
        assertNonNull(this.buffer[index]);
        if (depth < this.buffer[index]) {
            this.buffer[index] = depth;
            return true;
        }

        return false;
    }

    get(x: number, y: number): number {
        const ix = Math.round(x + this.width / 2);
        const iy = Math.round(this.height / 2 - y);

        if (!this.inBounds(ix, iy)) {
            return this.DEFAULT_DEPTH;
        }

        const index = iy * this.width + ix;
        assertNonNull(this.buffer[index]);

        return this.buffer[index];
    }
}

class Renderer {
    buffer: FrameBuffer;
    zbuffer: ZBuffer;

    constructor(width: number, height: number) {
        this.buffer = new FrameBuffer(width, height);
        this.zbuffer = new ZBuffer(width, height);
    }

    crossProduct(a: Point2d, b: Point2d): number {
        return (a.x*b.y) - (a.y*b.x);
    }

    edgeFunction(edge: Point2d, start: Point2d, point: Point2d): number {
        const v = subtract2D(point, start);
        return this.crossProduct(edge, v);
    }

    inTriangle(e0: number, e1: number, e2: number): boolean {
        const hasNeg = e0 < 0 || e1 < 0 || e2 < 0;
        const hasPos = e0 > 0 || e1 > 0 || e2 > 0;

        return !(hasNeg && hasPos);
    }

    // edge functions here!
    rasterizeTriangles(data: RenderData) {
        for(const [index, triangle] of data.triangles.entries()) {
            const a = data.vertices[triangle.a];
            const b = data.vertices[triangle.b];
            const c = data.vertices[triangle.c];
            assertNonNull(a);
            assertNonNull(b);
            assertNonNull(c);       
            
            const ab = subtractVertex(b, a);
            const bc = subtractVertex(c, b);
            const ca = subtractVertex(a, c);

            const vec_a = renderVertexTo2d(a);
            const vec_b = renderVertexTo2d(b);
            const vec_c = renderVertexTo2d(c);

            const areaABC = this.edgeFunction(ab, vec_a, vec_c);
            if (areaABC === 0) {
               continue;
            }
            // now we have triangles :P 
            // edge function to rasterize
            // and z value buffer, for draw or not

            // get min X and max X, min Y and max Y
            // draw a bounding box around the triangle
            // clamp 'em to integers
            const minX = Math.floor(Math.min(a.screenX, b.screenX, c.screenX));
            const maxX = Math.ceil(Math.max(a.screenX, b.screenX, c.screenX));

            const minY = Math.floor(Math.min(a.screenY, b.screenY, c.screenY));
            const maxY = Math.ceil(Math.max(a.screenY, b.screenY, c.screenY));

            // iterate over the pixels
            for(let y = minY; y <= maxY; y++) {
                for(let x = minX; x <= maxX; x++) {
                    // check with edge function for all 3 edges
                    const p: Point2d = { x, y };           

                    const e0 = this.edgeFunction(bc, vec_b, p);
                    const e1 = this.edgeFunction(ca, vec_c, p);
                    const e2 = this.edgeFunction(ab, vec_a, p);

                    // check if the signs are all positive            
                    if(this.inTriangle(e0, e1, e2)) {
                        // to interpolate depth, you need areas and divide each by ABC to get the deph
                        const lambdaA = e0 / areaABC;
                        const lambdaB = e1 / areaABC;
                        const lambdaC = e2 / areaABC;

                        const depth = lambdaA * a.depth + lambdaB * b.depth + lambdaC * c.depth;
                        
                        // test and set it in z buffer
                        if(this.zbuffer.testAndSet(x, y, depth)) {
                            // if yes, draw the point in framebuffer
                            this.buffer.set(x, y, "#ffffff");
                        }
                                
                    }

                }
            }
        }
    }

    reset() {
        this.buffer.clear();
        this.zbuffer.clear();
    }   


    render(data: Array<RenderData>): Uint8ClampedArray {
        for(const unit of data) {
            this.rasterizeTriangles(unit);
        }
        const imagedata = this.buffer.flatten();
        this.reset();
        return imagedata;
    }
}

export { FrameBuffer, Renderer };