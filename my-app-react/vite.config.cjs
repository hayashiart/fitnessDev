import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
const fs = require('fs')
const path = require('path');


export default defineConfig({
  
  plugins: [
    react(),
    svgr() 
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/localhost.pem')),
    },
    port: 5173,
  },
});