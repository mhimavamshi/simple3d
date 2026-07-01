import { SObject } from "./object";

interface BaseContext {
    delta: number
}

interface RotationContext extends BaseContext {
    angularSpeed: number
}


function rotateX(object: SObject, ctx: RotationContext) {
    const angle = ctx.angularSpeed * ctx.delta;

    console.log(object.pivot);

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const pivot = object.computeCenter(object.mesh);
    console.log("before", object.computeCenter(object.mesh));

    for (const vertex of object.mesh.vertices) {
        // Translate to pivot
        const x = vertex.x - pivot.x;
        const y = vertex.y - pivot.y;
        const z = vertex.z - pivot.z;

        // Rotate around X
        const ry = y * c - z * s;
        const rz = y * s + z * c;

        // Translate back
        vertex.x = x + pivot.x;
        vertex.y = ry + pivot.y;
        vertex.z = rz + pivot.z;
    }
    console.log("after", object.computeCenter(object.mesh));

}

function rotateY(object: SObject, ctx: RotationContext) {
    
}

function rotateZ(object: SObject, ctx: RotationContext) {
    
}

export { type RotationContext, rotateX, rotateY, rotateZ };