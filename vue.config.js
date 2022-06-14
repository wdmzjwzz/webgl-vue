
module.exports = {
    // 选项
    chainWebpack: config => {
        config.module
            .rule('frag')
            .test(/\.frag$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
        config.module
            .rule('vert')
            .test(/\.vert$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()

    }
} 