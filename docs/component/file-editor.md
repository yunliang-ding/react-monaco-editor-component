---
order: 3
title: FileEditor 文件编辑器
toc: menu
---

## 基本使用

```tsx
import React from 'react';
import { FileEditor } from 'react-web-ide-component';

const files = [
  {
    path: '/User/project/src/index.ts',
    type: 'file',
    extension: '.ts',
    name: 'index.ts',
    status: 'open',
    size: 102,
    notSave: false,
    content: `export default () => {
  return 'demo'
}`,
  },
  {
    path: '/User/project/src/config.json',
    type: 'file',
    extension: '.json',
    name: 'config.json',
    status: 'open',
    size: 102,
    notSave: false,
    content: `{
  "name": "123abc"
}`,
  },
];
export default () => {
  const editorMonacoRef = React.useRef({});
  return (
    <FileEditor
      files={files}
      selectedKey={files[0].path}
      editorMonacoRef={editorMonacoRef}
      style={{ width: '100%', height: 500 }}
      onClose={(file) => {
        console.log('onClose', file);
      }}
      onClick={(file) => {
        console.log('onClick', file);
      }}
      onChange={(code) => {
        console.log('onChange', code);
      }}
      onSave={async (code) => {
        await new Promise((res) => setTimeout(res, 1000));
        console.log('onSave', code);
      }}
    />
  );
};
```

## API

<API src="../../src/file-editor/index.tsx" hideTitle></API>
