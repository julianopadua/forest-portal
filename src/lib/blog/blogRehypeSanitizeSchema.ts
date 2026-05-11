import type { Schema } from "hast-util-sanitize";
import { defaultSchema } from "rehype-sanitize";

const star = defaultSchema.attributes?.["*"] ?? [];

const svgPaint = ["fill", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin", "opacity"] as const;

/**
 * Extends GitHub-style defaults so blog authors can embed small HTML/CSS
 * diagrams (Tailwind className + inline SVG) without script or event handlers.
 */
export const blogRehypeSanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "svg",
    "path",
    "circle",
    "rect",
    "line",
    "g",
    "text",
    "defs",
    "marker",
    "polyline",
    "title",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...star, "className"],
    svg: [
      "className",
      "viewBox",
      "xmlns",
      "width",
      "height",
      "role",
      "ariaHidden",
      "ariaLabel",
      "focusable",
      ...svgPaint,
    ],
    path: ["className", "d", ...svgPaint],
    circle: ["className", "cx", "cy", "r", ...svgPaint],
    rect: ["className", "x", "y", "width", "height", "rx", ...svgPaint],
    line: ["className", "x1", "y1", "x2", "y2", ...svgPaint],
    g: ["className", "transform", ...svgPaint],
    text: ["className", "x", "y", "dx", "dy", "textAnchor", "fill"],
    polyline: ["className", "points", ...svgPaint],
    marker: ["id", "markerWidth", "markerHeight", "refX", "refY", "orient", "markerUnits"],
    defs: ["className"],
    title: [],
  },
};
