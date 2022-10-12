import { useState, CSSProperties } from 'react';
import { GitHubApiProps } from '../github-api';
import Sider from './sider';
import Footer from './footer';
import Main from './main';
import './index.less';

interface MyCodeSpaceProps {
  gitConfig: GitHubApiProps;
  style?: CSSProperties;
}

/** 整合小部件 */
export default ({ gitConfig, style = {} }: MyCodeSpaceProps) => {
  const [siderKey, setSiderKey] = useState<string>('Code');
  const [notSaveCount, setNotSaveCount] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  // 侧边栏点击
  const siderBarClick = (key) => {
    if (key === siderKey) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(false);
    }
    setSiderKey(key);
  };
  return (
    <div className="my-code-space" style={style}>
      <Sider
        diffLength={0}
        notSaveCount={notSaveCount}
        siderKey={siderKey}
        onClick={siderBarClick}
      />
      <Main
        setNotSaveCount={setNotSaveCount}
        gitConfig={gitConfig}
        collapsed={collapsed}
        siderKey={siderKey}
      />
      <Footer
        currentBranch={gitConfig.branch}
        waitCommit={0}
        onPush={() => {}}
      />
    </div>
  );
};
