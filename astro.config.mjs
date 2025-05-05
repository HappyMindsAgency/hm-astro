// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          logger: {
            warn: function(message) {
              // Suppress deprecation warnings
              if (!message.includes('deprecated')) {
                console.warn(message);
              }
            }
          }
        }
      }
    }
  }
});