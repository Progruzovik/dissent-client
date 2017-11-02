const webpack = require("webpack");

module.exports = env => {
    return {
        devtool: "source-map",
        entry: "./src/main/typescript/main.ts",
        module: {
            rules: [
                {
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        output: {
            filename: "./target/classes/static/js/" + (env.production ? "app.min.js" : "app.js")
        },
        plugins: env.production ? [
            new webpack.optimize.UglifyJsPlugin({ comments: false })
        ] : [],
        resolve: {
            extensions: [".js", ".ts"]
        }
    }
};
