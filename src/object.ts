import type { Point3d, Mesh } from "./geometry";
import { assertNonNull } from "./utils";
    
class SObject {
    pos: Point3d;
    mesh: Mesh;

    constructor(pos: Point3d, mesh: Mesh) {
        this.pos = pos;
        this.mesh = mesh;
    }

}

// function of ObjectTransforms
type ObjectTransform = (object: SObject) => void;

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

    applyToAll(transform: ObjectTransform) {
        for (const [name, object] of this.objects) {
            transform(object);
        }
    }

    apply(name: string, transform: ObjectTransform) {
        let object = this.objects.get(name);
        assertNonNull(object);
        transform(object);
    }

    *[Symbol.iterator]() {
        for (const object of this.objects.values()) {
            yield object;
        }
    }

}

export { ObjectManager, SObject }
