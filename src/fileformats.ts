import type { Mesh, Point3d, Triangle } from "./geometry";

function loadOBJ(text: string): Mesh {
    const vertices: Point3d[] = [];
    const triangles: Triangle[] = [];

    const lines = text.split(/\r?\n/);

    for (const rawLine of lines) {
        const line = rawLine.trim();

        // Ignore blank lines and comments
        if (line === "" || line.startsWith("#")) {
            continue;
        }

        const parts = line.split(/\s+/);

        switch (parts[0]) {
            case "v": {
                vertices.push({
                    x: Number(parts[1]),
                    y: Number(parts[2]),
                    z: Number(parts[3]),
                });
                break;
            }

            case "f": {
                // Supports:
                // f 1 2 3
                // f 1/2 3/4 5/6
                // f 1/2/3 4/5/6 7/8/9
                // f 1//3 2//4 3//5

                const indices = parts
                    .slice(1)
                    .map(token => Number(token.split("/")[0]) - 1);



                // Triangulate polygons (fan triangulation)
                for (let i = 1; i < indices.length - 1; i++) {
                    triangles.push({
                        a: indices[0]!,
                        b: indices[i]!,
                        c: indices[i + 1]!,
                    });
                }

                break;
            }
        }
    }

    return {
        vertices,
        triangles,
    };
}

export { loadOBJ };