import { iconMapping } from '@/file-explorer/icon-mapping';
import { FileProps } from '@/file-explorer/types';
import { FileEditorProps } from '../types';

const prefix = 'ide-editor-file-editor-header';

export default ({
  files = [],
  selectedKey,
  onClick,
  onClose,
  extra,
  extraExpansionRender,
}: FileEditorProps) => {
  const currentFile: FileProps = files.find(
    (file) => file.path === selectedKey,
  );
  if (currentFile === undefined) {
    return null;
  }
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
          {files.map((tab, index) => {
            return (
              <div
                key={tab.path}
                className={
                  tab.path === selectedKey
                    ? `${prefix}-tabs-left-item ${prefix}-tabs-left-item-selected`
                    : `${prefix}-tabs-left-item`
                }
                onClick={() => {
                  onClick(tab);
                }}
              >
                <i className={`file-icon ${iconMapping[tab.extension]}`} />
                <span className={`${prefix}-tabs-left-item-label`}>
                  {tab.name}
                </span>
                {tab.notSave && (
                  <div className={`${prefix}-tabs-left-item-dot`} />
                )}
                <div
                  className={`${prefix}-tabs-left-item-remove`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tab.notSave) {
                      const result = confirm('当前文件未保存，是否确认关闭?');
                      if (result) {
                        onClose(tab, index);
                      }
                    } else {
                      onClose(tab, index);
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
                    item.onClick(currentFile);
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
