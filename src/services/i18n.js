import i18next from 'i18next';
import resources from '../locales/en.json';

i18next.init({
  lng: 'en',
  resources: resources
});

export default function t(key, options = {}) {
  if (key === i18next.t(key, options)) {
    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-line
      throw `${key.toString()} is not translated`;
    }
  }

  return i18next.t(key, options);
}
