import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import defaultConfig from './vite.config';

export default defineConfig(async (env) => {
  const rendererConfig = defaultConfig(env);
  const isProduction = 'production' in env.mode.split('-');
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        minify: isProduction,
        emptyOutDir: true,
        lib: {
          entry: 'main/index.ts',
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        minify: isProduction,
        emptyOutDir: true,
        outDir: '../../dist/apps/imarkedit-app/electron/preload',
        lib: {
          entry: 'preload/index.ts',
        },
      },
    },
    renderer: {
      ...rendererConfig,
      build: {
        ...rendererConfig.build,
        minify: isProduction,
        outDir: '../../dist/apps/imarkedit-app/electron/renderer',
        rollupOptions: {
          input: 'index.html',
        },
      },
    },
  };
});
