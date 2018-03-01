const common = require("./webpack.common");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");

module.exports = merge(common, {
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(common.output.path),
        new CopyWebpackPlugin(
            [{ from: "./node_modules/skeleton-css/css/", to: path.resolve(common.output.path, "css") },
            { from: './src/main/resources/static/', to: common.output.path }]
        )
    ]
});
