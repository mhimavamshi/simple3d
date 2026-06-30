import type { Degrees, Point2d, Point3d, Radians, RenderVertex } from "./geometry";  

function degreesToRadians(degrees: Degrees): Radians {
    return degrees * (Math.PI / 180);
}

function add3D(a: Point3d, b: Point3d): Point3d {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    }
}

function subtract3D(a: Point3d, b: Point3d): Point3d {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    }
}
 
function subtract2D(a: Point2d, b: Point2d): Point2d {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    }
}
 
function subtractVertex(a: RenderVertex, b: RenderVertex): Point2d {
    return {
        x: a.screenX - b.screenX,
        y: a.screenY - b.screenY,
    }
}
 

export { degreesToRadians, add3D, subtract3D, subtract2D, subtractVertex };