const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    devtool: "source-map",
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: "./static/js/" + (isProduction ? "app.min.js" : "app.js")
    },
    plugins: isProduction ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ] : [],
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["./src/", "./node_modules/"]
    }
};
