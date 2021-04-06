const plugins = []

if (process.env.NODE_ENV !== "production ") {

    plugins.push("react-refresh/babel");
}

module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        ["@babel/preset-react", {runtime: "automatic"}],
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        ...plugins
    ]
}