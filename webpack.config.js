const path = require('path')

module.exports = {
    entry: {
        app: './app.js',
    },
    output: {
        filename: '[name].dist.js',
        path: path.resolve(__dirname)
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}
