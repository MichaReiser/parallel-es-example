var webpack = require("webpack");
var Config = require("webpack-config").Config;

module.exports = new Config().extend("conf/webpack.base.config.js").merge({
    devtool: "#source-map",
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
        // new webpack.optimize.UglifyJsPlugin({ // Seems to break worker source maps
        //    sourceMap: true
        //}) Besides breaks paralleljs tests because of renaming environment variables
    ]
});
