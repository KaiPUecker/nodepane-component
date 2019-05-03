module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/index.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    watch: true
}