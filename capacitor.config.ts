import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.seopro.analyzer',
  appName: 'SEO Pro',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
  server: {
    url: "https://2b458dd0-a755-4119-b873-100189321f21.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#8B5CF6",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
