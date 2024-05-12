/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

type Platform = 'web' | 'electron' | 'capacitor' | 'browser_extension';

export function extractPlatformFromMode(mode: string): [Platform, string] {
  // Split mode into two parts: platform and environment.
  const [environment, platform] = mode.split('-');
  return [(platform as Platform) ?? 'web', environment ?? 'dev'];
}

export function getExtensionByPlatform(platform: Platform): string[] {
  switch (platform) {
    case 'electron':
      return ['.electron.tsx', '.electron.ts'];
    case 'capacitor':
      return ['.capacitor.tsx', '.capacitor.ts'];
    case 'browser_extension':
      return ['.ext.tsx', '.ext.ts'];
    default:
      return [];
  }
}

export default defineConfig(({ mode }) => {
  const [platform, environment] = extractPlatformFromMode(mode);
  console.log('Running on', platform, 'for', environment);
  return {
    mode: environment,
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/imarkedit-app/web',

    resolve: {
      extensions: [...getExtensionByPlatform(platform), '.ts', '.tsx', '.json'],
    },

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      emptyOutDir: true,
      outDir: '../../dist/apps/imarkedit-app/web',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      minify: environment === 'production',
      rollupOptions: {
        external: ['react-use'],
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/imarkedit-app/web',
        provider: 'v8',
      },
    },
  };
});
