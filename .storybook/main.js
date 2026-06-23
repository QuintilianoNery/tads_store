

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  // Serve a pasta public/ na raiz (logos, favicon) e, à parte, os prints de
  // referência de layout. As imagens de referência ficam em
  // .storybook/reference/ (fora de public/) para NÃO irem ao build de produção,
  // mas continuam servidas em /reference/*.png para as stories.
  "staticDirs": [
    "../public",
    { from: "./reference", to: "/reference" }
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite"
};
export default config;