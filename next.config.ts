import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  // OpenNext Cloudflare: blog e docs leem disco em dev; em producao usam JSON gerado no prebuild
  // (posts.generated.json, docs.generated.json). outputFileTracingIncludes mantem fallback em Node.
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*"],
    "/docs/api/v1": ["./content/docs/**/*"],
  },
};

export default createMDX()(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
