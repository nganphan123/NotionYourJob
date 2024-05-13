const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.ts"),
    popup: path.resolve(__dirname, "..", "src", "popup.ts"),
    auth: path.resolve(__dirname, "..", "src", "auth.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NOTION_OAUTH_SECRET": JSON.stringify(
        process.env.NOTION_OAUTH_SECRET || ""
      ),
      "process.env.NOTION_OAUTH_CLIENT": JSON.stringify(
        process.env.NOTION_OAUTH_CLIENT || ""
      ),
    }),
    new HtmlWebpackPlugin({
      title: "notionjobs", // change this to your app title
      manifest: "manifest.json",
      filename: "popup.html",
      template: path.resolve(__dirname, "..", "src", "popup.html"),
      hash: true,
    }),
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
