import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/whatsapp-dashboard/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/whatsapp-dashboard/"],
      },
    ],
    sitemap: "https://www.dmspark.in/sitemap.xml",
    host: "https://www.dmspark.in",
  }
}

