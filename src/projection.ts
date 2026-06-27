import type { Point2d, Point3d } from "./geometry";  

function projectTo2d(pt: Point3d): Point2d {
    return {
        x: pt.x / pt.z,
        y: pt.y / pt.z
    }
}

function projectAllTo2d(pts: Array<Point3d>): Array<Point2d> {
    let points = [];
    for(let point of pts) {
        points.push(projectTo2d(point));
    }
    return points;
}


export { projectTo2d, projectAllTo2d };