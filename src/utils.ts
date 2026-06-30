import type { Point2d, RenderVertex } from "./geometry";

function assertNonNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message ?? "Value is null or undefined");
  }
}

function renderVertexTo2d(v: RenderVertex): Point2d {
  return {x: v.screenX, y: v.screenY};
}

export { assertNonNull, renderVertexTo2d };                                           