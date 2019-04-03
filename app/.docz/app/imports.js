export const imports = {
  'components/common/button/Button.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-common-button-button" */ 'components/common/button/Button.mdx'),
}
