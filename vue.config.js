// const { defineConfig } = require("@vue/cli-service");
module.exports = {
  // transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://43.153.176.209:8080/app",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
