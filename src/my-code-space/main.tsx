/* eslint-disable no-alert */
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
import { useEffect, useMemo, useRef, useState } from 'react';
import { editorRefInstance } from '@/file-editor/types';
import { getFileByPath } from '@/util';
import { commitAndPushCode, getDiffTreeData } from './util';

const prefixCls = 'my-code-space-main';

export default ({
  gitConfig,
  collapsed,
  siderKey,
  setNotSaveCount,
  setDiffCount,
}) => {
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
    setTreeData(
      JSON.parse(localStorage.getItem('my-code-space-tree-data')) ||
        (await githubInstance.getTreeAndContent()),
    );
    explorerRef.current.closeSpin();
  };
  useEffect(() => {
    queryTree();
  }, []);
  const querySearch = async () => {};
  const queryGit = async () => {};
  const [treeData, setTreeData] = useState<FileProps[]>([]);
  const [activeKey, setActiveKey] = useState<string>(
    localStorage.getItem('my-code-space-selectedKey') || '',
  );
  useEffect(() => {
    explorerRef.current.setSelected(activeKey);
  }, [activeKey]);
  const fristRender = useRef(true);
  useEffect(() => {
    if (!fristRender.current) {
      localStorage.setItem('my-code-space-tree-data', JSON.stringify(treeData));
    }
    fristRender.current = false;
    // 同步 diff 个数
    setDiffCount(getDiffTreeData(treeData).length);
  }, [treeData]);
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
                } else {
                  const treeFile = getFileByPath(file.path, treeData);
                  treeFile.status =
                    treeFile.status === 'expanded' ? 'nomal' : 'expanded';
                  setTreeData([...treeData]);
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
              treeData={getDiffTreeData(treeData)}
              onRefresh={queryGit}
              onCommit={async (message, diffTree) => {
                try {
                  await commitAndPushCode(message, diffTree, githubInstance);
                  // 同步本地文件
                  getDiffTreeData(treeData, false).forEach((item) => {
                    item.remoteContent = item.content;
                    item.remotePath = item.path;
                    delete item.gitStatus;
                    // 更新 Tab
                    editorRef.current.updateTabByPath(item.path, {
                      remoteContent: item.content,
                      gitStatus: undefined,
                    });
                    // 更新 Diff Tab
                    editorRef.current.updateTabByPath(`~diff/${item.path}`, {
                      remoteContent: item.content,
                      gitStatus: undefined,
                    });
                  });
                  setTreeData([...treeData]);
                } catch (error) {
                  alert('代码提交失败');
                }
              }}
              onClick={(file) => {
                editorRef.current.addDiffTab(file);
              }}
            />
          </div>
        </div>
        <div className={`${prefixCls}-content`}>
          <FileEditor
            editorRef={editorRef}
            openCache
            treeData={treeData}
            extra={[
              {
                key: 'preview',
                icon: 'codicon codicon-open-preview',
                title: '预览',
                visible(file) {
                  return file.extension === '.tsx';
                },
                onClick(file) {
                  console.log(file);
                },
              },
              {
                icon: 'codicon codicon-compare-changes',
                key: 'changes',
                title: '代码对比',
                onClick(file) {
                  editorRef.current.addDiffTab(file);
                },
                visible: ({ gitStatus }) => {
                  return gitStatus !== undefined;
                },
              },
            ]}
            onClick={(file) => {
              setActiveKey(file.path);
            }}
            onClose={(file) => {
              setActiveKey(file?.path);
            }}
            onChange={(code) => {
              setNotSaveCount(editorRef.current.getTotalNotSaveCount());
            }}
            onSave={async (code) => {
              const file = editorRef.current.getCurrentTab();
              const treeFile = getFileByPath(file.path, treeData);
              treeFile.content = code;
              if (code !== treeFile.remoteContent) {
                treeFile.gitStatus = 'M';
                setTreeData([...treeData]);
              } else {
                delete treeFile.gitStatus;
                setTreeData([...treeData]);
              }
              // 更新 git 状态
              editorRef.current.updateTabByPath(file.path, {
                gitStatus: treeFile.gitStatus,
                notSave: false,
              });
              // 更新 Diff git
              editorRef.current.updateTabByPath(`~diff/${file.path}`, {
                content: file.content,
                gitStatus: treeFile.gitStatus,
              });
              setNotSaveCount(editorRef.current.getTotalNotSaveCount());
            }}
          />
        </div>
      </SplitPane>
    </div>
  );
};
