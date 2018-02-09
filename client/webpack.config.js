const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = env => {
    const isProduction = env && env.production;
    const buildDir = "./target/classes/static/";

    const copyPluginPaths = [{ from: "./node_modules/skeleton-css/css/", to: buildDir + 'css/' }];
    if (!isProduction) {
        copyPluginPaths.push({ from: './src/main/resources/static/', to: buildDir });
    }
    const copyPlugin = new CopyWebpackPlugin(copyPluginPaths);

    return {
        devtool: "source-map",
        entry: "./src/main/ts/main.ts",
        module: {
            loaders: [
                {
                    loader: "awesome-typescript-loader",
                    test: /\.tsx?$/
                }
            ]
        },
        output: {
            filename: buildDir + "js/app.js"
        },
        plugins: isProduction ? [
            new webpack.optimize.UglifyJsPlugin({ comments: false }), copyPlugin
        ] : [
            new CleanWebpackPlugin(buildDir), copyPlugin,
        ],
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
    }
};
