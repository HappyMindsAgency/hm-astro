// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            // Se hai delle variabili globali puoi aggiungere:
          }
        }
      }
    }
});