var path = require("path");
var ParallelEsPlugin = require("parallel-es-webpack-plugin");

const FILE_NAME = "[name].js";

module.exports = {
    devtool: "#source-map",
    entry: {
        examples: "./src/browser-example.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: FILE_NAME
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader?useBabel"
            }, {
                test: /\.parallel-es6\.js/,
                loader: "source-map"
            }
        ]
    },
    plugins: [
        new ParallelEsPlugin({
            babelOptions: {
                "presets": [
                    ["es2015", { "modules": false }]
                ]
            }
        })
    ]
};
