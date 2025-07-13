import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Disable console logs in production (when deployed)
if (window.location.hostname !== 'localhost') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Keep console.warn and console.error for important messages
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
