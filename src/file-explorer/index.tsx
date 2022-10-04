import { FileExplorerProps, FileProps } from './types';
import { useEffect, useState } from 'react';
import { RenderFileTree } from './snippets';
import { getOpenFiles } from './util';
import Header from '@/compontent/header';
import CreateSpin from '@/compontent/create-spin';
import { getFileByPath, isEmpty, uuid } from '@/util';
import './index.less';

const prefixCls = 'ide-component-file-explorer';

const spin = CreateSpin({
  getContainer: () => document.querySelector(`.${prefixCls}`),
  text: '加载中...',
});

export default ({
  style = {},
  onClick = () => {},
  onOpenFileChange = () => {},
  projectName = 'EXPLORER',
  header = true,
  onRefresh,
  onAddFile,
  onAddFolder,
  explorerRef,
}: FileExplorerProps) => {
  const [files, setFiles] = useState<FileProps[]>();
  const [selectedKey, setSelected] = useState<string>();
  // 扩展 api
  useEffect(() => {
    explorerRef.current.openSpin = spin.open;
    explorerRef.current.closeSpin = spin.close;
    explorerRef.current.setSelectedKey = setSelected;
    explorerRef.current.setFiles = setFiles;
    explorerRef.current.getFields = () => {
      return files;
    };
  }, []);
  /** 文件点击 */
  const onFileClick = (file: FileProps) => {
    if (file.type === 'directory') {
      file.status = file.status === 'expanded' ? 'nomal' : 'expanded';
    }
    setSelected(file.path);
    setFiles([...files]);
    onClick(file);
    onOpenFileChange(getOpenFiles(files));
  };
  useEffect(() => {
    onOpenFileChange(getOpenFiles(files));
  }, []);
  // 文件夹全部收起
  const onUnFold = () => {};
  // 打开新增表单文件
  const addNewFile = () => {
    let currentNode = files; // 默认节点为根
    if (selectedKey) {
      const currentFile = getFileByPath(selectedKey, files);
      if (currentFile.type === 'directory') {
        // 当前目录为根
        currentNode = currentFile.children;
      } else {
        const parentPath = selectedKey.substring(
          0,
          selectedKey.lastIndexOf('/'),
        );
        const currentFileParent = getFileByPath(parentPath, files);
        if (!isEmpty(currentFileParent)) {
          // 取父节点目录为根
          console.log('currentFileParent', currentFileParent);
          currentNode = currentFileParent.children;
        }
      }
    }
    currentNode.push({
      path: uuid(12),
      name: '',
      status: 'new',
      extension: '',
      type: 'file',
    });
    setFiles([...files]);
  };
  const addNewFileDone = (fileName) => {
    if (isEmpty(fileName)) {
      const _files = files.filter((i) => i.status !== 'new');
      return setFiles(_files);
    }
    const idx = files.findIndex((i) => i.status === 'new');
    // 创建文件
    files[idx].path = `${files[0].path}/${fileName}`;
    files[idx].name = fileName;
    files[idx].status = 'nomal';
    setFiles([...files]);
  };
  return (
    <div className={`${prefixCls} show-file-icons`} style={style}>
      {header && (
        <Header
          title={[projectName.toLocaleUpperCase()].join(': ')}
          actions={[
            {
              icon: 'codicon codicon-new-file',
              title: 'New File',
              onClick: addNewFile,
            },
            {
              icon: 'codicon codicon-new-file',
              title: 'New Folder',
              onClick: onAddFolder,
            },
            {
              icon: 'codicon codicon-refresh',
              title: 'Refresh Explorer',
              onClick: onRefresh,
            },
            {
              icon: 'codicon codicon-collapse-all',
              title: 'Collapse Folders in Explorer',
              onClick: onUnFold,
            },
          ]}
        />
      )}
      <div className={`${prefixCls}-body`}>
        <RenderFileTree
          dataSource={files}
          selectedKey={selectedKey}
          prefixCls={prefixCls}
          onFileClick={onFileClick}
          onAddDone={addNewFileDone}
        />
      </div>
    </div>
  );
};
