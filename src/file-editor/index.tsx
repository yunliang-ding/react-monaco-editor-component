import { FileEditorMainProps } from './types';
import Tabs from './components/tabs';
import Main from './components/main';
import CreateSpin from '@/compontent/create-spin';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { FileProps } from '@/file-explorer/types';
import './index.less';

const defaultExtra = [
  {
    icon: 'codicon codicon-split-horizontal',
    key: 'split',
    title: '新窗口',
  },
  {
    icon: 'codicon codicon-toolbar-more',
    key: 'more',
    title: '更多',
  },
];
const prefixCls = 'ide-editor-file-editor';

const spin = CreateSpin({
  getContainer: () => document.querySelector(`.${prefixCls}`),
  text: '保存中...',
});

export default ({
  files,
  selectedKey,
  style = {},
  extra = [],
  onExtraClick = () => {},
  onClick = () => {},
  onClose = () => {},
  onChange = () => {},
  onSave = (code) => {},
  extraExpansionRender = () => [],
  editorExpansionRender = (file, dom) => {
    return dom;
  },
}: FileEditorMainProps) => {
  const [_selectedKey, setSelectedKey] = useState<string>(selectedKey);
  const [innerFiles, setInnerFiles] = useState<FileProps[]>([]);
  useEffect(() => {
    setInnerFiles(cloneDeep(files)); // 剔除引用关系
  }, [files]);
  // Ctrl + S
  const keyboardEvent = async (e) => {
    if (
      (e.key === 's' || e.key === 'S') &&
      (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
      spin.open();
      await onSave(window[`ide-editor-${_selectedKey}`]?.getValue());
      spin.close();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', keyboardEvent);
    return () => {
      window.removeEventListener('keydown', keyboardEvent);
    };
  }, [_selectedKey]);
  return (
    <div style={style} className={`${prefixCls} show-file-icons`}>
      {innerFiles.length > 0 ? (
        <>
          <Tabs
            files={innerFiles}
            extraExpansionRender={extraExpansionRender}
            selectedKey={_selectedKey}
            onClick={(file) => {
              setSelectedKey(file.path);
              onClick(file);
            }}
            onClose={(file, index) => {
              innerFiles.splice(index, 1);
              setInnerFiles([...innerFiles]);
              setSelectedKey(innerFiles[0]?.path);
              onClose(file);
            }}
            extra={[...extra, ...defaultExtra]}
            onExtraClick={onExtraClick}
          />
          {innerFiles.map((file) => {
            return (
              <div
                key={file.path}
                style={{
                  width: '100%',
                  height: '100%',
                  display: file.path === _selectedKey ? 'block' : 'none',
                }}
              >
                {editorExpansionRender(
                  file,
                  <div className="ide-editor-file-editor-body">
                    <Main
                      id={`ide-editor-${file.path}`}
                      mode="nomal"
                      options={{
                        language: {
                          '.json': 'json',
                          '.js': 'javascript',
                          '.ts': 'javascript',
                          '.tsx': 'javascript',
                        }[file.extension],
                      }}
                      value={file.content}
                      onChange={(code) => {
                        onChange?.(code);
                      }}
                    />
                  </div>,
                )}
              </div>
            );
          })}
        </>
      ) : (
        <img
          width={300}
          src="https://img.alicdn.com/imgextra/i1/O1CN01ypboF828fH2ScXohX_!!6000000007959-55-tps-40-40.svg"
        />
      )}
    </div>
  );
};
