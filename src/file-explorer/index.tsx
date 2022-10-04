import { FileExplorerProps, FileProps } from './types';
import { useEffect, useRef, useState } from 'react';
import { RenderFileTree } from './snippets';
import { getOpenFiles } from './util';
import Header from '@/compontent/header';
import CreateSpin from '@/compontent/create-spin';
import { getFileByPath, isEmpty, uuid } from '@/util';
import { cloneDeep } from 'lodash';
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
  onCreateFile = async () => true,
  explorerRef,
}: FileExplorerProps) => {
  const editFileRef = useRef<FileProps>();
  const [files, setFiles] = useState<FileProps[]>();
  const [selectedKey, setSelected] = useState<string>();
  // 扩展 api
  useEffect(() => {
    explorerRef.current.openSpin = spin.open;
    explorerRef.current.closeSpin = spin.close;
    explorerRef.current.setSelectedKey = setSelected;
    explorerRef.current.setFiles = (files) => {
      setFiles(cloneDeep(files)); // 剔除引用关系
    };
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
  // 打开新增文件
  const createFile = (type: 'file' | 'directory') => {
    // 默认节点为根
    let currentNode = {
      path: files[0]?.path.substring(0, files[0]?.path.lastIndexOf('/')),
      children: files,
    };
    if (selectedKey) {
      const currentFile = getFileByPath(selectedKey, files);
      if (currentFile.type === 'directory') {
        // 当前目录为根
        currentNode = currentFile;
      } else {
        const parentPath = selectedKey.substring(
          0,
          selectedKey.lastIndexOf('/'),
        );
        const currentFileParent = getFileByPath(parentPath, files);
        if (!isEmpty(currentFileParent)) {
          // 取父节点目录为根
          currentNode = currentFileParent;
        }
      }
    }
    editFileRef.current = {
      path: [currentNode.path, uuid(6)].join(','),
      name: '',
      status: 'new',
      type,
    };
    if (type === 'directory') {
      editFileRef.current.children = [];
    }
    currentNode.children.push(editFileRef.current);
    setFiles([...files]);
  };
  // 新增文件完毕
  const createFileDone = async (fileName: string) => {
    editFileRef.current.extension = fileName.substring(
      fileName.lastIndexOf('.'),
    );
    editFileRef.current.name = fileName;
    editFileRef.current.status = 'nomal';
    editFileRef.current.path = [
      editFileRef.current.path.split(',')[0],
      fileName,
    ].join('/');
    // 等待外面确认
    try {
      spin.open();
      await onCreateFile(editFileRef.current);
      setFiles([...files]);
    } catch (error) {
      console.log(error);
    } finally {
      spin.close();
    }
  };
  /** 渲染 vNode */
  return (
    <div className={`${prefixCls} show-file-icons`} style={style}>
      {header && (
        <Header
          title={[
            'explorer'.toLocaleUpperCase(),
            projectName.toLocaleUpperCase(),
          ].join(': ')}
          actions={[
            {
              icon: 'codicon codicon-new-file',
              title: 'New File',
              onClick: () => {
                createFile('file');
              },
            },
            {
              icon: 'codicon codicon-new-file',
              title: 'New Folder',
              onClick: () => {
                createFile('directory');
              },
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
          onAddDone={createFileDone}
        />
      </div>
    </div>
  );
};
