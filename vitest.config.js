// vitest.config.js — configuração de testes do projeto.
// Roda as stories do Storybook como testes de componente em um navegador real
// (Chromium) via Playwright. Reaproveita os aliases de vite.config.js.
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
    plugins: [
      storybookTest({ configDir: join(dir, '.storybook') }),
    ],
    test: {
      name: 'storybook',
      // Desde o Storybook 10.3, o @storybook/addon-vitest aplica automaticamente
      // as anotações do preview.jsx (tokens, fonte, parâmetros) — sem setup file.
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  })
);
