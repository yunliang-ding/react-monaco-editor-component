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

export default () => {
  return (
    <MyCodeSpace
      gitConfig={{
        owner: 'yunliang-ding', // 拥有者
        repo: 'demo-github-api', // 项目名
        branch: 'main', // 分支
        token: 'ghp_xXydYL03OBhChcreE3w0mSmWAy9VQ1lln1OXMQ3VHxTh', // token、可在 github 上生成
      }}
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

### 获取项目目录

```ts
// 可返回 sha1
githubInstance.getTree();
```

```tsx
import React from 'react';
import { FileExplorer, GithubApi } from 'react-monaco-editor-component';

const githubInstance = GithubApi.create({
  owner: 'yunliang-ding',
  repo: 'demo-github-api',
  branch: 'main',
  token: 'ghp_xXydYL03OBhChcreE3w0mSmWAy9VQ1lln1OXMQ3VHxTh',
});

export default () => {
  const explorerRef = React.useRef({});
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin();
    await new Promise((res) => setTimeout(res, 800));
    explorerRef.current.setFiles(await githubInstance.getTree());
    explorerRef.current.closeSpin();
  };
  React.useEffect(() => {
    init();
  }, []);
  return (
    <FileExplorer
      projectName="monaco-editor-compontent"
      explorerRef={explorerRef}
      style={{ width: 260, height: 400 }}
      onRefresh={init}
      onClick={(file) => {
        console.log('onClick', file);
      }}
      onCreateFile={async (file) => {
        await new Promise((res) => setTimeout(res, 2000));
        console.log(file);
      }}
      onRenameFile={async (file) => {
        await new Promise((res) => setTimeout(res, 2000));
        console.log(file);
      }}
      onDeleteFile={async (file) => {
        await new Promise((res) => setTimeout(res, 2000));
        console.log(file);
      }}
    />
  );
};
```

### 创建文件

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

### 提交树

```ts
githubInstance.commitNewTree({
  message: '备注信息',
  tree: sha3,
});
```
