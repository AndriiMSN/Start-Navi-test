const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");

let mode = "development";
let target = "web";
let devtool = "source-map";
plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        template: "./src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin() // LAST ONLY
]

if (process.env.NODE_ENV === "production ") {
    mode = "production";
    target = "browserslist";
    devtool = "hidden-nosources-source-map";
    plugins.pop()
}

module.exports = {
    mode: mode,
    target: target,

    entry: ['babel-polyfill',"./src/js/index.ts"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.bundle.[contenthash].js",
        assetModuleFilename: "assets/[name][hash][ext]",
    },

    plugins: [...plugins],

    module: {
        rules: [
            {
                test: /\.(gif|jpg|png|jpeg|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash][ext]",
                },
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[hash][ext]",
                },
            },

            {
                // Include sass, scss, css
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "",
                        },
                    },
                    {
                        loader: "css-loader",
                    },

                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "resolve-url-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },

    devtool: devtool,

    devServer: {
        historyApiFallback: true,
        contentBase: "./dist",
        hot: true,
    },
};
