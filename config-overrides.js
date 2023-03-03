// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
    config.plugins.push(
        new NodePolyfillPlugin({
            excludeAliases: ["console"]
        })
    );
    config.resolve.fallback = {
        fs: false,
        console: require.resolve("console-browserify"),
        path: require.resolve("path-browserify")
    };
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};
