const common = require("./webpack.common");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require("webpack-merge");

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            camelCase: true,
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "css/style.css" })
    ]
});
