const { VueLoaderPlugin } = require('vue-loader');

module.exports =
{
    entry: 
    {
        "/js/bundle": "./src/app/index.js",
        "/user/js/bundle": "./src/app/user.js"
    },
    output:
    {
        path: __dirname + "/src/public/",
        filename: '[name].js'
    },
    module :
    {
        rules: 
        [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins:
    [
        new VueLoaderPlugin()
    ]
};
/*
module.exports =
{
    entry: "./src/app/user.js",
    output:
    {
        path: __dirname + "/src/public/user/js/",
        filename: 'bundle.js'
    },
    module :
    {
        rules: 
        [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins:
    [
        new VueLoaderPlugin()
    ]
};*/