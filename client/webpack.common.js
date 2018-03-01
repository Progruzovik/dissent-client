const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src", "main", "ts", "main.ts"),
    module: {
        rules: [
            {
                loader: "awesome-typescript-loader",
                test: /\.tsx?$/
            }
        ]
    },
    output: {
        filename: "js/app.js",
        path: path.resolve(__dirname, "target", "classes", "static")
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    }
};
