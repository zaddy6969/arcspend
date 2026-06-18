import type { MetadataRoute } from "next";

const routes = [
  "",
  "/dashboard",
  "/analytics",
  "/transactions",
  "/wallets",
  "/transfer",
  "/swap",
  "/bridge",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://arcspend.vercel.app${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
