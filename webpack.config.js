const slsw = require('serverless-webpack')
const path = require('path')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'node20',
      }),
    ],
  },
  externals: {
    deepmerge: 'deepmerge',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|\.ts$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          target: 'node20',
        },
      },
    ],
  },
}