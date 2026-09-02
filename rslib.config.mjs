import { defineConfig } from '@rslib/core';
import { pluginSass } from '@rsbuild/plugin-sass';

/**
 * Note: This project uses SWC directly for JS compilation (see .swcrc)
 * because rslib's bundleless output includes webpack runtime code that
 * conflicts with the consuming app's webpack build.
 * 
 * rslib is used only for CSS compilation (the combined index.css bundle).
 * 
 * Build commands:
 * - JS: swc (configured in package.json build:swc)
 * - CSS: rslib (this config) + sass CLI for individual component CSS
 */
export default defineConfig({
  lib: [
    // Combined CSS bundle only
    {
      format: 'cjs',
      bundle: true,
      source: {
        entry: {
          index: './src/styles.scss'
        }
      },
      output: {
        distPath: { root: './dist' }
      }
    }
  ],
  output: {
    target: 'web',
    minify: false
  },
  plugins: [
    pluginSass()
  ]
});
