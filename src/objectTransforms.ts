import { SObject } from "./object";

interface BaseContext {
    delta: number
}

interface RotationContext extends BaseContext {
    angularSpeed: number
}

function rotateX(object: SObject, ctx: RotationContext) {
    const angle = ctx.angularSpeed * ctx.delta;

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const pivot = object.pivot;

    for (const vertex of object.mesh.vertices) {
        const x = vertex.x - pivot.x;
        const y = vertex.y - pivot.y;
        const z = vertex.z - pivot.z;

        const ry = y * c - z * s;
        const rz = y * s + z * c;

        vertex.x = x + pivot.x;
        vertex.y = ry + pivot.y;
        vertex.z = rz + pivot.z;
    }
}

function rotateY(object: SObject, ctx: RotationContext) {
    
}

function rotateZ(object: SObject, ctx: RotationContext) {
    const angle = ctx.angularSpeed * ctx.delta;

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const pivot = object.pivot;

    for (const vertex of object.mesh.vertices) {
        const x = vertex.x - pivot.x;
        const y = vertex.y - pivot.y;
        const z = vertex.z - pivot.z;

        const rx = x * c - y * s;
        const ry = x * s + y * c;

        vertex.x = rx + pivot.x;
        vertex.y = ry + pivot.y;
        vertex.z = z + pivot.z;
    }
}

export { type RotationContext, rotateX, rotateY, rotateZ };