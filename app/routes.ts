import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  
  route("api/configs", "routes/api.configs.ts"),
  route("api/configs/:id", "routes/api.configs.$id.ts"),
] satisfies RouteConfig;
