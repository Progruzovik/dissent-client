const common = require("./webpack.common");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const merge = require("webpack-merge");

module.exports = merge(common, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(common.output.path),
        new CopyWebpackPlugin(
            [{ from: './src/main/resources/static/', to: common.output.path }]
        )
    ]
});
