import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite';
import defaultConfig from './vite.config';

export default defineConfig(async (env) => {
  const rendererConfig = defaultConfig(env);
  const isProduction = 'production' in env.mode.split('-');
  return {
    main: {
      plugins: [swcPlugin(), externalizeDepsPlugin()],
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
      plugins: [...rendererConfig.plugins],
      build: {
        ...rendererConfig.build,
        minify: isProduction,
        outDir: '../../dist/apps/imarkedit-app/electron/renderer',
        rollupOptions: {
          ...rendererConfig.build.rollupOptions,
          input: 'index.html',
        },
      },
    },
  };
});
