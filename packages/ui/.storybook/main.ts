import type { StorybookConfig } from "@storybook/react-vite";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    const path = await import("path");

    return mergeConfig(config, {
      resolve: {
        alias: {
          "next/navigation": path.resolve(
            __dirname,
            "./next-navigation-mock.ts"
          ),
          "next/link": path.resolve(__dirname, "./next-link-mock.tsx"),
        },
      },
      define: {
        "process.env": {},
      },
    });
  },
};
export default config;
