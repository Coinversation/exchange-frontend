const path = require('path')

module.exports = {
    publicPath: './',
    lintOnSave: false,
    runtimeCompiler: true,
    configureWebpack: {
        resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
    },
    transpileDependencies: ['@coreui/utils'],
    chainWebpack: (config) => {
        config.resolve.alias.set(
            'bn.js',
            path.resolve(path.join(__dirname, 'node_modules', 'bn.js'))
        )
    },

    // use this option for production linking
    // publicPath: process.env.NODE_ENV === 'production' ? '/vue/demo/3.1.0' : '/'
}
