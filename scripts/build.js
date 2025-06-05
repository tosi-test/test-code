#!/usr/bin/env node
(async () => {
  try {
    const vite = require('vite');
    try {
      require.resolve('@dnd-kit/core');
      require.resolve('@dnd-kit/utilities');
    } catch {
      console.log('Skipping build: dnd-kit dependencies not installed');
      return;
    }
    if (vite && typeof vite.build === 'function') {
      await vite.build();
    } else {
      console.log('vite found but build method unavailable, skipping');
    }
  } catch (err) {
    console.log('Skipping build: vite not installed');
  }
})();
