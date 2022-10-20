import { useState, CSSProperties, useRef } from 'react';
import { GitHubApiProps } from '../github-api';
import Sider from './sider';
import Footer from './footer';
import Main from './main';
import Preview from './preview';
import './index.less';

interface MyCodeSpaceProps {
  gitConfig: GitHubApiProps;
  style?: CSSProperties;
}

/** 整合小部件 */
export default ({
  gitConfig = {
    owner: '',
    repo: '',
    branch: '',
    token: '',
  },
  style = {},
}: MyCodeSpaceProps) => {
  const [siderKey, setSiderKey] = useState<string>('Code');
  const [notSaveCount, setNotSaveCount] = useState<number>(0);
  const [diffCount, setDiffCount] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  const previewRef = useRef({});
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
        diffCount={diffCount}
        notSaveCount={notSaveCount}
        siderKey={siderKey}
        onClick={siderBarClick}
      />
      <Main
        gitConfig={gitConfig}
        setNotSaveCount={setNotSaveCount}
        collapsed={collapsed}
        siderKey={siderKey}
        setDiffCount={setDiffCount}
        previewRef={previewRef}
      />
      <Preview previewRef={previewRef} />
      <Footer currentBranch={gitConfig.branch} diffCount={diffCount} />
    </div>
  );
};
