/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
    filename: "[hash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/html/index.html"
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: [path.join(__dirname, "src"), path.join(__dirname, "node_modules")]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: ["eslint-loader"]
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-react"],
                [
                  "@babel/preset-env",
                  { useBuiltIns: "usage", targets: ">0.25%", corejs: 3 }
                ]
              ]
            }
          },
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
              experimentalWatchApi: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader?modules"]
      }
    ]
  }
};
