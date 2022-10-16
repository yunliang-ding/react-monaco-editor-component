---
title: 集成 GitHub 方案
order: 1
toc: menu
nav:
  title: 集成 GitHub 方案
  order: 2
---

## 使用 MyCodeSpace 传入相关配置

```tsx
import React from 'react';
import { MyCodeSpace } from 'react-monaco-editor-component';

const getUrlSearchParams: any = (
  search = decodeURIComponent(location.hash).split('?')[1],
) => {
  const params = {};
  const searchParams: any = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export default () => {
  const searchParams = getUrlSearchParams();
  let gitConfig = {
    owner: 'yunliang-ding', // 拥有者
    repo: 'demo-github-api', // 项目名
    branch: 'main', // 分支
    token: 'ghp_xXydYL03OBhChcreE3w0mSmWAy9VQ1lln1OXMQ3VHxTh', // token、可在 github 上生成
  };
  if (searchParams.token) {
    gitConfig = searchParams;
  }
  return (
    <MyCodeSpace
      style={{ width: '100%', height: '100vh' }}
      gitConfig={gitConfig}
    />
  );
};
```

## 自定义参考如下步骤

### 生成 GithubApi 实例

```ts
import { GithubApi } from 'react-monaco-editor-component';

const githubInstance = GithubApi.create({
  owner: 'yunliang-ding', // 拥有者
  repo: 'demo-github-api', // 项目名
  branch: 'main', // 分支
  token: 'ghp_uBdfdfJnnQIeQniuyGIsl6adsd8i1Jm4Fv4aKpny', // token、可在 github 上生成
});
```

### 获取项目完整目录结构

```ts
githubInstance.getTreeAndContent();
```

### 创建文件

```ts
// 可返回 sha1
githubInstance.getTree();
```

```ts
// 可返回 sha2
githubInstance.createNewFile('just 你好 test');
```

### 创建提交树

```ts
// 可返回 sha3
githubInstance.createNewTree(sha1, [
  {
    path: 'src/index.tsx',
    mode: '100644',
    type: 'blob',
    sha: sha2,
  },
]);
```

### 提交并且推送树

```ts
githubInstance.commitAndPushNewTree({
  message: '备注信息',
  tree: sha3,
});
```
