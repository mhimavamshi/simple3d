import { Camera3D } from "./camera"
import type { Mesh, Point2d, RenderData, RenderVertex, Triangle } from "./geometry"
import { add3D, subtract3D } from "./mathutils"
import type { ObjectManager, SObject } from "./object"
import { projectAllTo2d } from "./projection"
import { assertNonNull } from "./utils"


class Pipeline {
    constructor() {

    }

    // we take in local object meshes and make them world meshes
    meshToWorld(object: SObject): Mesh {
        let vertices = [];
        for(const vertex of object.mesh.vertices) {
            vertices.push(add3D(object.pos, vertex));
        }
        return {
            vertices: vertices,
            triangles: object.mesh.triangles
        }        
    }

    // convert world meshes relative to camera
    // camera opposite rotation later
    worldToCamera(meshes: Array<Mesh>, camera: Camera3D): Array<Mesh> {
        const relativeMeshes: Array<Mesh> = [];
        for(const mesh of meshes) {
            const relativeVertices = [];
            for(const vertex of mesh.vertices) {
                relativeVertices.push(subtract3D(vertex, camera.pos));
            }
            const relativeMesh = {
                vertices: relativeVertices,
                triangles: mesh.triangles
            }
            relativeMeshes.push(relativeMesh);
        }
        return relativeMeshes;
    }

    // clip meshes by culling. culling by z <= 0. later: back face. near-plane and far-plane  
    clip(meshes: Array<Mesh>): Array<Mesh> {
        const NEAR = 0.1;
        const clippedMeshes: Array<Mesh> = [];
        for(const mesh of meshes) {
            const clippedTriangles: Array<Triangle> = [];
            // iterate over triangles, remove any if one of the vertice has z <= 0
            for(const triangle of mesh.triangles) {
                const a = mesh.vertices[triangle.a];
                const b = mesh.vertices[triangle.b];
                const c = mesh.vertices[triangle.c];
                assertNonNull(a);
                assertNonNull(b);
                assertNonNull(c);
                if(
                    a.z <= NEAR || 
                    b.z <= NEAR ||
                    c.z <= NEAR
                ) {
                    continue;
                }
                clippedTriangles.push(triangle);
            }
            clippedMeshes.push({
                triangles: clippedTriangles,
                vertices: mesh.vertices
            })
        }
        return clippedMeshes;
    }

    useFov(points: Array<Point2d>, camera: Camera3D) {
        for(const point of points) {
            point.x *= camera.focalLength * camera.aspect;
            point.y *= camera.focalLength;
        }
    } 

    // use camera fov tan(0/2) and scale by depth z (x/z, y/z)
    project(meshes: Array<Mesh>, camera: Camera3D): Array<RenderData> {
        const renderData = [];
        for(const mesh of meshes) {
            let projectedPoints: Array<Point2d> = projectAllTo2d(mesh.vertices);
            // handle fov and stuff later
            this.useFov(projectedPoints, camera);
            const renderVertices: Array<RenderVertex> = []; 
            for(const [i, point] of projectedPoints.entries()) {   
                assertNonNull(mesh.vertices[i]);
                renderVertices.push({screenX: point.x, screenY: point.y, depth: mesh.vertices[i].z});
            }
            renderData.push({
                vertices: renderVertices,
                triangles: mesh.triangles
            });
        }
        return renderData;
    }

    // we take in objects and a camera and then give optimized render data
    in(objects: ObjectManager, camera: Camera3D): Array<RenderData> {
        const worldMeshes = [];
        for(const object of objects) {
            worldMeshes.push(this.meshToWorld(object));
        } 
        const cameraMeshes = this.worldToCamera(worldMeshes, camera);
        const clipped = this.clip(cameraMeshes); 
        const projected = this.project(clipped, camera);
        // const renderData = this.viewport(projected); later or not needed because frame buffer is there?
        return projected;
    }

}

export { Pipeline, type RenderData };