import type { Point3d, Mesh } from "./geometry";
import { assertNonNull } from "./utils";
    
class SObject {
    pos: Point3d;
    mesh: Mesh;
    pivot: Point3d;

    constructor(pos: Point3d, mesh: Mesh) {
        this.pos = pos;
        this.mesh = mesh;
        this.pivot = this.computeCenter(mesh);
    }

    computeCenter(mesh: Mesh): Point3d {
        let x = 0, y = 0, z = 0;

        for (const v of mesh.vertices) {
            x += v.x;
            y += v.y;
            z += v.z;
        }

        const n = mesh.vertices.length;

        return {
            x: x / n,
            y: y / n,
            z: z / n,
        };
    }

}

// function of ObjectTransforms
type ObjectTransform<TContext> = (object: SObject, ctx: TContext) => void;

// handles named objects
// you can get all objects in the world
// you can get an object by a name
// you can add, delete named objects
class ObjectManager {
    objects: Map<string, SObject>;

    constructor() {
        this.objects = new Map();
    }

    add(name: string, object: SObject) {
        this.objects.set(name, object);
    }

    delete(name: string): boolean {
        return this.objects.delete(name);
    }

    has(name: string): boolean {
        return this.objects.has(name);
    }

    get count(): number {
        return this.objects.size;
    }

    applyToAll<TContext>(transform: ObjectTransform<TContext>, ctx: TContext) {
        for (const [name, object] of this.objects) {
            transform(object, ctx);
        }
    }

    apply<TContext>(name: string, transform: ObjectTransform<TContext>, ctx: TContext) {
        let object = this.objects.get(name);
        assertNonNull(object);
        transform(object, ctx);
    }

    *[Symbol.iterator]() {
        for (const object of this.objects.values()) {
            yield object;
        }
    }

}

export { ObjectManager, SObject }
