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
import {
  addDiffTreeFile,
  clearDiffTree,
  commitAndPushCode,
  getDiffTree,
  setDiffTree,
} from './util';
import { fromBase64 } from 'js-base64';

const prefixCls = 'my-code-space-main';

export default ({
  gitConfig,
  collapsed,
  siderKey,
  setNotSaveCount,
  setDiffCount,
  previewRef,
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
    setDiffTree(treeData);
    // 同步 diff 个数
    setDiffCount(getDiffTree().length);
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
              onClick={async (f) => {
                const treeFile = getFileByPath(f.path, treeData);
                if (treeFile.type === 'file') {
                  // 加载文件内容，如果还没有缓存的话
                  if (!treeFile.content && treeFile.gitStatus !== 'U') {
                    editorRef.current.spin.open();
                    const {
                      data: { content },
                    } = await githubInstance.getContent(treeFile.sha);
                    treeFile.content = fromBase64(content);
                    treeFile.remoteContent = fromBase64(content);
                    editorRef.current.spin.close();
                  }
                  setActiveKey(treeFile.path);
                  editorRef.current.addTab(treeFile as any);
                } else {
                  treeFile.status =
                    treeFile.status === 'expanded' ? 'nomal' : 'expanded';
                }
                setTreeData([...treeData]);
              }}
              onCreateFile={async (file, files) => {
                await new Promise((res) => setTimeout(res, 500));
                setTreeData([...files]);
              }}
              onRenameFile={async (file) => {
                await new Promise((res) => setTimeout(res, 500));
              }}
              onDeleteFile={async (file, files) => {
                if (file.gitStatus !== 'U') {
                  addDiffTreeFile({
                    ...file,
                    gitStatus: 'D',
                  });
                }
                await new Promise((res) => setTimeout(res, 500));
                // 同步删除 Tab
                editorRef.current.removeTab(file.path);
                setTreeData([...files]);
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
              treeData={getDiffTree()}
              onRefresh={queryGit}
              onCommit={async (message, diffTree) => {
                try {
                  await commitAndPushCode(message, diffTree, githubInstance);
                  // 同步本地文件
                  getDiffTree().forEach((item) => {
                    const treeFile = getFileByPath(
                      item.path.replace('~diff/', ''),
                      treeData,
                    );
                    treeFile.remoteContent = treeFile.content;
                    treeFile.remotePath = treeFile.path;
                    delete treeFile.gitStatus;
                    // 更新 Tab
                    editorRef.current.updateTabByPath(treeFile.path, {
                      remoteContent: treeFile.content,
                      gitStatus: undefined,
                    });
                    // 更新 Diff Tab
                    editorRef.current.updateTabByPath(
                      `~diff/${treeFile.path}`,
                      {
                        remoteContent: treeFile.content,
                        gitStatus: undefined,
                      },
                    );
                  });
                  clearDiffTree();
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
                  return (
                    ['.tsx', '.jsx', '.ts', '.js'].includes(file.extension) &&
                    !file.path.startsWith('~diff')
                  );
                },
                onClick(file) {
                  // 打开预览
                  previewRef.current.code = file.content;
                  previewRef.current.path = file.path;
                  previewRef.current.open();
                },
              },
              {
                icon: 'codicon codicon-compare-changes',
                key: 'changes',
                title: '代码对比',
                onClick(file) {
                  editorRef.current.addDiffTab(file);
                },
                visible: ({ gitStatus, path }) => {
                  return gitStatus !== undefined && !path.startsWith('~diff');
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
                treeFile.gitStatus = treeFile.gitStatus || 'M';
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
              // 刷新预览页面
              if (
                previewRef.current.path === file.path &&
                previewRef.current.open
              ) {
                previewRef.current.code = code;
                previewRef.current.reload();
              }
            }}
          />
        </div>
      </SplitPane>
    </div>
  );
};
