const common = require("./webpack.common");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");

module.exports = merge(common, {
    plugins: [
        new CopyWebpackPlugin(
            [{ from: "./node_modules/skeleton-css/css/", to: path.resolve(common.output.path, "css") }]
        )
    ]
});
