/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // 使生成的 html 文件可访问
  distDir: 'extension-dist', // 自定义输出目录
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
