---
order: 4
title: FileSearch 文件查找
toc: menu
---

## 基本使用

```tsx
import React from 'react';
import { FileSearch } from 'react-web-ide-component';

export default () => {
  const explorerRef = React.useRef({});
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin();
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
        status: 'nomal',
        children: [],
        content: '',
      },
      {
        path: '/User/project/app.tsx',
        type: 'file',
        extension: '.tsx',
        name: 'app.tsx',
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
    <FileSearch
      style={{ width: 260, height: 400 }}
      explorerRef={explorerRef}
      onRefresh={init}
      onClick={(file) => {
        console.log('onClick', file);
      }}
      onSearch={async (keyword) => {
        await new Promise((res) => setTimeout(res, 1000));
        console.log(keyword);
      }}
    />
  );
};
```
