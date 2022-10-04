---
order: 2
title: FileExplorer 文件目录
toc: menu
---

## 基本使用

```tsx
import React from 'react';
import { FileExplorer } from 'react-web-ide-component';
import files from './files.json';

export default () => {
  const explorerRef = React.useRef({});
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin();
    // 模拟接口
    await new Promise((res) => setTimeout(res, 1000));
    explorerRef.current.setFiles(files);
    explorerRef.current.closeSpin();
  };
  React.useEffect(init, []);
  return (
    <FileExplorer
      projectName="react-web-ied-compontent"
      explorerRef={explorerRef}
      style={{ width: 260, height: 500 }}
      onRefresh={init}
      onClick={(file) => {
        console.log('onClick', file);
      }}
      onCreateFile={async (file) => {
        await new Promise((res) => setTimeout(res, 1000));
        console.log(file);
      }}
      onRename={(file) => {
        console.log(file);
      }}
      onRemove={(file) => {
        console.log(file);
      }}
    />
  );
};
```

## API

<API src="../../src/file-explorer/index.tsx" hideTitle></API>
