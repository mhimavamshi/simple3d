import type { Degrees, Point3d, Radians } from "./geometry";  

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
 
export { degreesToRadians, add3D, subtract3D };