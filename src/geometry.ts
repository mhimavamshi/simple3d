interface Point2d {
    x: number;
    y: number;
}

interface Point3d extends Point2d {
    z: number;
}

export type { Point2d, Point3d };