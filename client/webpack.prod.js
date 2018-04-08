const common = require("./webpack.common");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require("webpack-merge");

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader",
                        options: {
                            camelCase: true,
                            url: false
                        }
                    }
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/style.css")
    ]
});
