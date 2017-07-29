module.exports = {
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
        filename: "./static/js/app.js"
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["./src/", "./node_modules/"]
    }
};
