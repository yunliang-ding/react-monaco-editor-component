---
order: 5
title: GitManager 源码管理
toc: menu
---

## 基本使用

```tsx
import React from 'react';
import { GitManager } from 'react-monaco-editor-component';

export default () => {
  const explorerRef = React.useRef({});
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin({
      text: '加载中...',
    });
    // 模拟接口
    await new Promise((res) => setTimeout(res, 1000));
    explorerRef.current.setFiles([
      {
        path: '/User/project/config.json',
        type: 'file',
        extension: '.json',
        name: 'config.json',
        size: 102,
        notSave: false,
        gitStatus: 'U',
        status: 'nomal',
        children: [],
        content: '',
      },
      {
        path: '/User/project/app.tsx',
        type: 'file',
        extension: '.tsx',
        name: 'app.tsx',
        gitStatus: 'M',
        status: 'nomal',
        size: 102,
        notSave: false,
        children: [],
        content: '',
      },
    ]);
    explorerRef.current.closeSpin();
  };
  React.useEffect(init, []);
  return (
    <GitManager
      style={{ width: 260, height: 400 }}
      explorerRef={explorerRef}
      onRefresh={init}
      onClick={(file) => {
        console.log('onClick', file);
      }}
    />
  );
};
```

## API

<API src="../../src/git-manager/index.tsx" hideTitle></API>
