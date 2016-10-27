var path = require("path");
var webpack = require("webpack");
var ParallelEsPlugin = require("parallel-es-webpack-plugin");

module.exports = {
    devtool: "#inline-source-map",
    entry: {
        examples: "./src/browser-example.ts",
        "performance-measurements": "./src/performance-measurement.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        pathinfo: true,
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: path.resolve("./src/transpiled"),
                loader: "babel!awesome-typescript-loader"
            },
            {
                test: /\.ts$/,
                include: path.resolve("./src/transpiled"),
                loader: `babel?${JSON.stringify({"plugins": [ "parallel-es"] })}!awesome-typescript-loader`
            },
            {
                test: /\.parallel-es6\.js/,
                loader: "source-map"
            }
        ],
        noParse: [ /benchmark\/benchmark\.js/ ]
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"],
        modules:[
              path.join(__dirname, "node_modules")
        ]
    },
    devServer: {
        stats: {
            chunks: false
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("common"),
        new ParallelEsPlugin({
            babelOptions: {
                "presets": [
                    ["es2015", { "modules": false }]
                ]
            }
        })
    ]
};
