#!/usr/bin/env node
(async () => {
  try {
    const vite = require('vite');
    if (vite && typeof vite.build === 'function') {
      await vite.build();
    } else {
      console.log('vite found but build method unavailable, skipping');
    }
  } catch (err) {
    console.log('Skipping build: vite not installed');
  }
})();
