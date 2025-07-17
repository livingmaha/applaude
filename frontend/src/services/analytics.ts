import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

mixpanel.init(MIXPANEL_TOKEN, {debug: import.meta.env.DEV});

export const analytics = {
  track: (eventName: string, properties?: object) => {
    if (import.meta.env.PROD) {
      mixpanel.track(eventName, properties);
    } else {
      console.log(`[Analytics Event]: ${eventName}`, properties);
    }
  },
  identify: (userId: string) => {
    if (import.meta.env.PROD) {
        mixpanel.identify(userId);
    }
  },
  setUserProperties: (properties: object) => {
    if (import.meta.env.PROD) {
        mixpanel.people.set(properties);
    }
  }
};
