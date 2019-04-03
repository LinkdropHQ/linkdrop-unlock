import { css } from 'docz-plugin-css'

export default {
  source: './components/common',
  plugins: [
    css({
      preprocessor: 'postcss',
      cssmodules: true,
      loaderOpts: {
        /* whatever your preprocessor loader accept */
      }
    })
  ]
}
