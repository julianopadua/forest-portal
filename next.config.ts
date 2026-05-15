import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  // OpenNext Cloudflare runs the server from `/bundle`; blog posts are read from disk via
  // `process.cwd()/content/blog` in `src/lib/blog/loadPost.ts`. Without this, those files are
  // not copied into the standalone trace and Workers throw ENOENT on `readdir`.
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
    "/docs/api/v1": ["./content/docs/**/*"],
  },
};

export default createMDX()(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
