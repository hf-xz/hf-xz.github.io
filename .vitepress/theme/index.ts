// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

import MyGiscus from './components/MyGiscus.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-after': () => h(MyGiscus)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
