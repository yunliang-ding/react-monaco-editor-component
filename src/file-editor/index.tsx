import { FileEditorMainProps } from './types';
import Tabs from './components/tabs';
import Main from './components/main';
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
  extra = [],
  onExtraClick,
  onClick,
  onClose,
  onChange,
  onSave,
  extraExpansionRender,
  editorExpansionRender = (file, dom) => {
    return dom;
  },
}: FileEditorMainProps) => {
  return (
    <div className={`${prefixCls} show-file-icons`}>
      {files.length > 0 ? (
        <>
          <Tabs
            files={files}
            extraExpansionRender={extraExpansionRender}
            selectedKey={selectedKey}
            onClick={onClick}
            onClose={onClose}
            extra={[...extra, ...defaultExtra]}
            onExtraClick={onExtraClick}
          />
          {files.map((file) => {
            return (
              <div
                key={file.path}
                style={{
                  width: '100%',
                  height: '100%',
                  display: file.path === selectedKey ? 'block' : 'none',
                }}
              >
                {editorExpansionRender(
                  file,
                  <div className="ide-editor-file-editor-body">
                    <Main
                      id={`monaco-container-${file.path}`}
                      mode={file.stageId !== undefined ? 'diff' : 'nomal'}
                      options={{
                        readOnly: file.path.endsWith('.designer.json'),
                        language:
                          file.path.endsWith('.designer') ||
                          file.path.endsWith('.json')
                            ? 'json'
                            : 'javascript',
                      }}
                      value={file.content}
                      originalValue={file.stageContent}
                      onChange={(code) => {
                        onChange?.(code);
                      }}
                      onSave={async (code) => {
                        try {
                          await onSave?.(code);
                        } catch (error) {
                          throw Error(error);
                        }
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
