import { FileEditorProps } from './types';
import HeaderTabs from './components/tabs';
import Main from './components/main';
import CreateSpin from '@/compontent/create-spin';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState, useMemo } from 'react';
import { FileProps } from '@/file-explorer/types';
import { uuid } from '@/util';
import { sleep } from '@/file-explorer';
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

export default ({
  files,
  selectedKey,
  style = {},
  extra = [],
  onClick = () => {},
  onClose = () => {},
  onChange = () => {},
  onSave = sleep,
  editorMonacoRef,
  monacoOptions,
  editorRef = useRef({
    addTab: {},
  } as any),
}: FileEditorProps) => {
  const domKey = useMemo(() => `class-${uuid(12)}`, []);
  const spin = CreateSpin({
    getContainer: () => document.querySelector(`.${domKey}`),
    text: '保存中...',
  });
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
      try {
        const file = innerFiles.find((i) => i.path === _selectedKey);
        const content = window[`ide-editor-${_selectedKey}`]?.getValue?.();
        await onSave(content); // 等待外面，通过之后再更新状态
        file.content = content;
        file.notSave = false;
        setInnerFiles([...innerFiles]);
      } catch (error) {
        console.log(error);
      } finally {
        spin.close();
      }
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', keyboardEvent);
    return () => {
      window.removeEventListener('keydown', keyboardEvent);
    };
  }, [_selectedKey]);
  // 扩展相关的 API
  useEffect(() => {
    // 新增tab
    editorRef.current.addTab = (tab) => {
      innerFiles.push({
        type: 'file',
        extension: '.preview',
        ...tab,
      });
      setInnerFiles([...innerFiles]);
      setSelectedKey(tab.path);
    };
    // 切换到指定的tab
    editorRef.current.checkTab = (key: string) => {
      setSelectedKey(key);
    };
  }, [innerFiles]);
  return (
    <div style={style} className={`${prefixCls} show-file-icons ${domKey}`}>
      {innerFiles.length > 0 ? (
        <>
          <HeaderTabs
            files={innerFiles}
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
                <div className="ide-editor-file-editor-body">
                  {typeof file.render === 'function' ? (
                    // 自定义渲染
                    file.render(file)
                  ) : (
                    <Main
                      id={`ide-editor-${file.path}`}
                      editorMonacoRef={editorMonacoRef}
                      mode={file.gitStatus !== undefined ? 'diff' : undefined}
                      monacoOptions={{
                        language: {
                          '.json': 'json',
                          '.js': 'javascript',
                          '.ts': 'javascript',
                          '.tsx': 'javascript',
                        }[file.extension],
                        ...monacoOptions,
                      }}
                      value={file.content}
                      originalValue={file.stageContent}
                      onChange={(code) => {
                        // 判断是否修改了
                        file.notSave = code !== file.content;
                        setInnerFiles([...innerFiles]);
                        onChange?.(code);
                      }}
                    />
                  )}
                </div>
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
