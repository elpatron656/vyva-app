import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Binds to all network interfaces for local network mobile access
    https: true
  }
});
