import type { Point3d, Rotation, Degrees, Radians } from "./geometry";
import { degreesToRadians } from "./mathutils"; 

class Camera3D {
    pos: Point3d;
    rotation: Rotation;
    fov: Radians;
    viewportWidth: number;
    viewportHeight: number;
    focalLength: number;
    aspect: number;
    
    constructor(width: number, height: number) {
        this.pos = {x: 0, y: 0, z: 0};
        this.rotation = {pitch: 0, yaw: 0, roll: 0};
        this.fov = Math.PI / 4;
        this.viewportWidth = width;
        this.viewportHeight = height;

        this.focalLength = (this.viewportHeight / 2) / Math.tan(this.fov/2);
        this.aspect = this.viewportWidth / this.viewportHeight;
    }

    setFov(fov: Radians) {
        this.fov = fov;
        this.recomputeProjection();
    }

    private recomputeProjection() {
        this.aspect = this.viewportWidth / this.viewportHeight;
        this.focalLength =
            (this.viewportHeight / 2) / Math.tan(this.fov / 2);
    }

}

export { Camera3D };