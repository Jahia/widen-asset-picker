const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const glob = require("glob")

module.exports = {
    entry: {
        "bundle.js": glob.sync("build/static/?(js|css|gif)/*.?(js|css|gif)").map(f => path.resolve(__dirname, f)),
    },
    output: {
        filename: "build/static/js/widenAssetSelector.min.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|gif)$/,
                loaders: ['file-loader']
            }
        ],
    },
    plugins: [new UglifyJsPlugin()],
}