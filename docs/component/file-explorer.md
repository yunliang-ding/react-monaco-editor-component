---
order: 2
title: FileExplorer 文件目录
toc: menu
---

## 基本使用

```tsx
import React from 'react';
import { FileExplorer, GithubApi } from 'react-monaco-editor-component';
import files from './files.json';
import filesGit from './files-git.json';

export default () => {
  const explorerRef = React.useRef({});
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin();
    await new Promise((res) => setTimeout(res, 1000));
    explorerRef.current.setFiles(files);
    explorerRef.current.closeSpin();
  };
  React.useEffect(init, []);
  return (
    <>
      <button
        onClick={() => {
          explorerRef.current.setFiles(files);
        }}
      >
        普通展示
      </button>
      &nbsp;
      <button
        onClick={() => {
          explorerRef.current.setFiles(filesGit);
        }}
      >
        文件打git标记
      </button>
      <br />
      <br />
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
    </>
  );
};
```

## API

<API src="../../src/file-explorer/index.tsx" hideTitle></API>
