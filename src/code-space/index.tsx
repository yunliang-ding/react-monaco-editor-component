import FileExplorer from '@/file-explorer';
import { explorerRefInstance } from '@/file-explorer/types';
import { useMemo, useRef, useEffect } from 'react';
import GithubApi, { GitHubApiProps } from '../github-api';

interface CodeSpaceProps {
  gitConfig: GitHubApiProps;
}

/** 整合小部件 */
export default ({ gitConfig }: mCodeSpaceProps) => {
  const explorerRef = useRef<explorerRefInstance>({} as any);
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
  useEffect(() => {
    init();
  }, []);
  return (
    <FileExplorer
      projectName="monaco-editor-compontent"
      explorerRef={explorerRef}
      style={{ width: 260, height: 400 }}
      onRefresh={init}
      onClick={(file) => {
        console.log('onClick', file);
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
  );
};
