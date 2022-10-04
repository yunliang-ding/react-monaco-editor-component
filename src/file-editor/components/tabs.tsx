import { iconMapping } from '@/file-explorer/icon-mapping';
import { FileEditorProps } from '../types';

const prefix = 'ide-editor-file-editor-header';

const StageMapping = {
  M: ' (Working Tree)',
  U: ' (Unstracked)',
};

export default ({
  files = [],
  selectedKey,
  onExtraClick,
  onClick,
  onClose,
  extra,
  extraExpansionRender,
}: FileEditorProps) => {
  const currentFile = files.find((file) => file.path === selectedKey) || {
    extension: '',
    name: '',
  };
  let dir = selectedKey.split('/');
  dir = dir.slice(0, dir.length - 1).filter((i) => i);
  // 扩展icon
  if (typeof extraExpansionRender === 'function') {
    extra = [...extraExpansionRender(currentFile), ...extra];
  }
  return (
    <div className="ide-editor-file-editor-header">
      <div className={`${prefix}-tabs`}>
        <div className={`${prefix}-tabs-left`}>
          {files.map((tab) => {
            return (
              <div
                key={tab.path}
                className={
                  tab.path === selectedKey
                    ? `${prefix}-tabs-left-item ${prefix}-tabs-left-item-selected`
                    : `${prefix}-tabs-left-item`
                }
                onClick={() => {
                  onClick(tab.path);
                }}
              >
                <i className={`file-icon ${iconMapping[tab.extension]}`} />
                <span
                  className={`${prefix}-tabs-left-item-label${tab.gitStatus}`}
                >
                  {tab.name}
                  {tab.stageId !== undefined && StageMapping[tab.gitStatus]}
                  &nbsp;&nbsp;{tab.gitStatus}
                </span>
                {tab.notSave && (
                  <div className={`${prefix}-tabs-left-item-dot`} />
                )}
                <div
                  className={`${prefix}-tabs-left-item-remove`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tab.notSave) {
                      // eslint-disable-next-line no-alert
                      const result = confirm('当前文件未保存，是否确认关闭?');
                      if (result) {
                        onClose(tab);
                      }
                    } else {
                      onClose(tab);
                    }
                  }}
                >
                  <i className="codicon codicon-close" />
                </div>
              </div>
            );
          })}
        </div>
        {extra && (
          <div className={`${prefix}-tabs-right`}>
            {extra.map((item) => {
              return (
                <i
                  className={item.icon}
                  title={item.title}
                  key={item.key}
                  onClick={() => {
                    onExtraClick(item.key, currentFile);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      {/* 面包屑 */}
      {selectedKey && !selectedKey.startsWith('~designer') && (
        <div className={`${prefix}-breadcrumbs`}>
          {dir.map((i) => {
            return (
              <div className={`${prefix}-breadcrumbs-dir`} key={i}>
                {i}
                <i className="codicon codicon-breadcrumb-separator" />
              </div>
            );
          })}
          <div className={`${prefix}-breadcrumbs-dir`}>
            <i className={`file-icon ${iconMapping[currentFile.extension]}`} />
            {currentFile.name}
          </div>
        </div>
      )}
    </div>
  );
};