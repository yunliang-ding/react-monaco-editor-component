import { defineConfig } from 'dumi';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default defineConfig({
  links: [
    {
      href: '/font/file-icon.css',
      rel: 'stylesheet',
    },
    {
      href: '/font/icon.css',
      rel: 'stylesheet',
    },
  ],
  mode: 'site',
  title: 'react-monaco-editor-component',
  outputPath: 'docs-dist',
  locales: [['zh-CN', '中文']],
  theme: {
    '@primary-background-color': '#4e60d4',
    '@text-color': '#6a6a6a',
    '@font-size-base': '13px',
    '@font-size-small': '12px',
    '@primary-color': '#4e60d4',
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
      },
      'antd',
    ],
  ],
  history: { type: 'hash' },
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/yunliang-ding/react-monaco-editor-component',
    },
  ],
  chainWebpack: (config) => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['json', 'javascript', 'typescript'],
      },
    ]);
  },
  // more config: https://d.umijs.org/config
});
