import type { Point3d, Rotation, Degrees, Radians } from "./geometry";
import { degreesToRadians } from "./mathutils"; 

class Camera3D {
    pos: Point3d;
    rotation: Rotation;
    fov: Radians;
    viewportWidth: number;
    viewportHeight: number;
    
    constructor(height: number, width: number) {
        this.pos = {x: 0, y: 0, z: 0};
        this.rotation = {pitch: 0, yaw: 0, roll: 0};
        this.fov = Math.PI / 2;
        this.viewportHeight = height;
        this.viewportWidth = width;
    }

    setFov(fov: Degrees) {
        this.fov = degreesToRadians(fov); 
    }

}

export { Camera3D };