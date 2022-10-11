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

const prefixCls = 'my-code-space-main';

export default ({ gitConfig, collapsed, siderKey }) => {
  const explorerRef = useRef<explorerRefInstance>({} as any);
  const explorerGitRef = useRef<explorerRefInstance>({} as any);
  const explorerSearchRef = useRef<explorerRefInstance>({} as any);
  const githubInstance = useMemo(() => {
    return GithubApi.create(gitConfig);
  }, [gitConfig]);
  /** 请求数据 */
  const init = async () => {
    explorerRef.current.openSpin();
    await new Promise((res) => setTimeout(res, 800));
    explorerRef.current.setFiles(await githubInstance.getTree());
    explorerRef.current.closeSpin();
  };
  /** 请求数据 */
  const initGit = async () => {
    explorerRef.current.openSpin();
    await new Promise((res) => setTimeout(res, 800));
    explorerRef.current.setFiles(await githubInstance.getTree());
    explorerRef.current.closeSpin();
  };
  /** 请求数据 */
  const initSearch = async () => {
    explorerRef.current.openSpin();
    await new Promise((res) => setTimeout(res, 800));
    explorerRef.current.setFiles(await githubInstance.getTree());
    explorerRef.current.closeSpin();
  };
  useEffect(() => {
    init();
  }, []);
  const [tabs, setTabs] = useState<FileProps[]>([]);
  const [activeKey, setActiveKey] = useState<string>('');
  // 使用 ctrl + s 保存的时候原生事件中获取state有问题，所以存在本地中解决下
  useEffect(() => {
    localStorage.setItem('__active_key__', activeKey);
  }, [activeKey]);
  console.log('tabs', tabs);
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
              onRefresh={init}
              onClick={(file) => {
                if (file.type === 'file') {
                  setActiveKey(file.path);
                }
              }}
              onOpenFileChange={(files) => {
                setTabs(files);
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
              onSearch={initSearch}
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
              onRefresh={initGit}
              onClick={(file) => {
                console.log('onClick', file);
              }}
            />
          </div>
        </div>
        <div className={`${prefixCls}-content`}>
          <FileEditor
            files={tabs}
            selectedKey={activeKey}
            onClose={(file) => {
              console.log('onClose', file);
            }}
            onClick={(file) => {
              console.log('onClick', file);
            }}
            onChange={(code) => {
              console.log('onChange', code);
            }}
            onSave={async (code) => {
              await new Promise((res) => setTimeout(res, 1000));
              console.log('onSave', code);
            }}
          />
        </div>
      </SplitPane>
    </div>
  );
};
