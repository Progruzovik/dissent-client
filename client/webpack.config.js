const webpack = require("webpack");

module.exports = env => {
    const isProduction = env && env.production;
    return {
        devtool: "source-map",
        entry: "./src/main/ts/main.ts",
        module: {
            loaders: [
                {
                    loader: "awesome-typescript-loader",
                    exclude: /node_modules/
                }
            ]
        },
        output: {
            filename: "./target/classes/static/js/app.js"
        },
        plugins: isProduction ? [
            new webpack.optimize.UglifyJsPlugin({ comments: false })
        ] : [],
        resolve: {
            extensions: [".js", ".ts"]
        }
    }
};
