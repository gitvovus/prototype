module.exports = {
  publicPath: '',
  configureWebpack: {
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.(svg)(\?.*)?$/i,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 8192 },
            },
          ],
        },
      ],
    },
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .test(() => false)
      .use('file-loader');
  },
}
