// vitest.config.js — configuração de testes do projeto (dois projetos):
//  • unit      → testes de unidade em node (lógica pura: validação, preços, etc.)
//  • storybook → stories do Storybook como testes de componente em navegador
//                real (Chromium) via Playwright.
// Ambos reaproveitam os aliases/plugins de vite.config.js via `extends: true`.
// Mais detalhes: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
import { mergeConfig, defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import viteConfig from './vite.config.js';

const dir = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['tests/**/*.test.{js,jsx}'],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: join(dir, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  })
);
