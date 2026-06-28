interface Point2d {
    x: number,
    y: number
}

interface Point3d extends Point2d {
    z: number
}

interface Triangle {
    a: number,
    b: number,
    c: number
}

interface Mesh {
    vertices: Array<Point3d>,
    triangles: Array<Triangle>
}

type Radians = number;
type Degrees = number;

interface Rotation {
    pitch: Radians,
    yaw: Radians,
    roll: Radians
}

interface RenderVertex {
    screenX: number,
    screenY: number,
    depth: number
}

interface RenderData {
    vertices: Array<RenderVertex>, 
    triangles: Array<Triangle>
}


export type { Point2d, Point3d, Triangle, Mesh, Radians, Degrees, Rotation, RenderVertex, RenderData };