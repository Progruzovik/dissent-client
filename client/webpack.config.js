const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = env => {
    const isProduction = env && env.production;
    const buildDir = "./target/classes/static/";
    return {
        devtool: "source-map",
        entry: "./src/main/ts/main.ts",
        module: {
            loaders: [
                {
                    loader: "awesome-typescript-loader",
                    test: /\.ts/
                }
            ]
        },
        output: {
            filename: buildDir + "js/app.js"
        },
        plugins: isProduction ? [
            new webpack.optimize.UglifyJsPlugin({ comments: false })
        ] : [
            new CleanWebpackPlugin(buildDir),
            new CopyWebpackPlugin([{ from: "./src/main/resources/static/", to: buildDir }])
        ],
        resolve: {
            extensions: [".js", ".ts"]
        }
    }
};
