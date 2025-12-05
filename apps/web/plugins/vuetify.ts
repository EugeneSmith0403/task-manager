import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

export default defineNuxtPlugin({
  name: 'vuetify',
  enforce: 'pre',
  setup(nuxtApp) {
    const vuetify = createVuetify({
      components,
      directives,
      ssr: true,
    });

    nuxtApp.vueApp.use(vuetify);
  },
});
