const webpack = require("webpack");

module.exports = env => {
    const isProduction = env && env.production;
    return {
        devtool: "source-map",
        entry: "./src/main/typescript/main.ts",
        module: {
            loaders: [
                {
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        output: {
            filename: "./target/classes/static/js/" + (isProduction ? "app.min.js" : "app.js")
        },
        plugins: isProduction ? [
            new webpack.optimize.UglifyJsPlugin({ comments: false })
        ] : [],
        resolve: {
            extensions: [".js", ".ts"]
        }
    }
};
