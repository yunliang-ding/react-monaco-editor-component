/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-assign */
import { explorerRefInstance } from '@/file-explorer/types';
import GithubApi from '../github-api';
import SplitPane from 'react-split-pane';
import {
  FileEditor,
  FileProps,
  FileExplorer,
  GitManager,
  FileSearch,
} from '..';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { editorRefInstance } from '@/file-editor/types';
import { getFileByPath } from '@/util';

const prefixCls = 'my-code-space-main';

export default ({ gitConfig, collapsed, siderKey, setNotSaveCount }) => {
  const explorerRef = useRef<explorerRefInstance>({} as any);
  const explorerGitRef = useRef<explorerRefInstance>({} as any);
  const explorerSearchRef = useRef<explorerRefInstance>({} as any);
  const editorRef = useRef<editorRefInstance>({} as any);
  const githubInstance = useMemo(() => {
    return GithubApi.create(gitConfig);
  }, [gitConfig]);
  /** 请求数据 */
  const queryTree = async () => {
    explorerRef.current.openSpin();
    setTreeData(await githubInstance.getTree());
    explorerRef.current.closeSpin();
  };
  useEffect(() => {
    queryTree();
  }, []);
  const querySearch = async () => {};
  const queryGit = async () => {};
  const [treeData, setTreeData] = useState<FileProps[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  useEffect(() => {
    explorerRef.current.setSelected(activeKey);
  }, [activeKey]);
  return (
    <div className={prefixCls}>
      <SplitPane
        split="vertical"
        size={collapsed ? 0 : 260}
        minSize={0}
        maxSize={600}
        onDragStarted={() => (document.body.style.cursor = 'col-resize')}
        onDragFinished={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <div className={`${prefixCls}-sider`}>
          <div
            className={`${prefixCls}-sider-content`}
            style={{ display: siderKey === 'Code' ? 'block' : 'none' }}
          >
            <FileExplorer
              projectName={gitConfig.repo}
              explorerRef={explorerRef}
              treeData={treeData}
              onRefresh={queryTree}
              onClick={(file) => {
                if (file.type === 'file') {
                  setActiveKey(file.path);
                  editorRef.current.addTab(file as any);
                }
              }}
              onCreateFile={async (file) => {
                await new Promise((res) => setTimeout(res, 2000));
              }}
              onRenameFile={async (file) => {
                await new Promise((res) => setTimeout(res, 2000));
              }}
              onDeleteFile={async (file) => {
                await new Promise((res) => setTimeout(res, 2000));
              }}
            />
          </div>
          <div
            className={`${prefixCls}-sider-content`}
            style={{ display: siderKey === 'Search' ? 'block' : 'none' }}
          >
            <FileSearch
              explorerRef={explorerSearchRef}
              onSearch={querySearch}
              onClick={(file) => {
                console.log('onClick', file);
              }}
            />
          </div>
          <div
            className={`${prefixCls}-sider-content`}
            style={{ display: siderKey === 'Git' ? 'block' : 'none' }}
          >
            <GitManager
              explorerRef={explorerGitRef}
              onRefresh={queryGit}
              onClick={(file) => {
                console.log('onClick', file);
              }}
            />
          </div>
        </div>
        <div className={`${prefixCls}-content`}>
          <CoreEditor
            {...{
              editorRef,
              setActiveKey,
              setNotSaveCount,
              setTreeData,
              treeData,
              activeKey,
            }}
          />
        </div>
      </SplitPane>
    </div>
  );
};

const CoreEditor = memo(
  ({
    editorRef,
    setActiveKey,
    setNotSaveCount,
    setTreeData,
    treeData,
  }: any) => {
    return (
      <FileEditor
        editorRef={editorRef}
        onClick={(file) => {
          setActiveKey(file.path);
        }}
        onClose={(file) => {
          setActiveKey(file?.path);
        }}
        onChange={(code, notSaveCount) => {
          setNotSaveCount(notSaveCount);
        }}
        onSave={async (code) => {
          const file = editorRef.current.getCurrentTab();
          const treeFile = getFileByPath(file.path, treeData);
          if (code !== treeFile.remoteContent) {
            treeFile.gitStatus = 'M';
            setTreeData([...treeData]);
          } else {
            delete treeFile.gitStatus;
            setTreeData([...treeData]);
          }
          await new Promise((res) => setTimeout(res, 1000));
        }}
      />
    );
  },
  (pre, next) => {
    return pre.activeKey === next.activeKey;
  },
);
