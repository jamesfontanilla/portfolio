import { defineConfig } from "sanity";
import { schemaTypes } from "@/sanity/schemaTypes";
import { studioStructure } from "@/sanity/structure";
import { structureTool } from "sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "portfolio-studio",
  title: "Portfolio Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure: studioStructure })],
  schema: {
    types: schemaTypes,
  },
});
