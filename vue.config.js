module.exports = {
  // 选项
  chainWebpack: (config) => {
    config.module
      .rule("frag")
      .test(/\.frag$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
    config.module
      .rule("vert")
      .test(/\.vert$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();

    config.when(
      process.env.NODE_ENV === "development", // 开发环境
      (config) => config.devtool("source-map") // 源码-慢
    );
  },
};
