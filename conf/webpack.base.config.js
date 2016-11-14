var path = require("path");
var webpack = require("webpack");
var Config = require("webpack-config").Config;
var ParallelEsPlugin = require("parallel-es-webpack-plugin");

module.exports = new Config().merge({
    entry: {
        examples: "./src/browser-example.ts",
        "performance-measurements": "./src/performance-measurement.ts"
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
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
                test: /\.js$/,
                include: path.resolve("./node_modules/Hamsters.js"),
                loader: "exports?hamsters=hamsters!babel"
            },
            {
                test: /parallel.*\.js/,
                include: path.resolve(require.resolve("parallel-es"), "../"),
                loader: "source-map"
            }
        ],
        noParse: [
            /benchmark\/benchmark\.js/,
            /paralleljs\/lib\/parallel\.js/
        ]
    },
    resolve: {
        alias: {
            "Hamsters.js": "Hamsters.js/src/es6/hamsters.js"
        },
        extensions: [".webpack.js", ".web.js", ".ts", ".js"],
        modules:[
              path.join(__dirname, "../node_modules")
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("common"),
        new ParallelEsPlugin({
            babelOptions: {
                "presets": [
                    ["es2015", { "modules": false }]
                ],
                "plugins": [
                    ["transform-runtime", {
                        "regenerator": false
                    }]
                ]
            }
        })
    ]
});
