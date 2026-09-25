import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tumedibot.app',
  appName: 'TuMedibot',
  webDir: 'public/build',
  server: {
    url: 'https://tumedibot.com',
    cleartext: false,
  },
};

export default config;
