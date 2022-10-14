import { useState, CSSProperties, useEffect } from 'react';
import { CreateModal } from 'react-core-form';
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
export default ({
  gitConfig = {
    owner: '',
    repo: '',
    branch: '',
    token: '',
  },
  style = {},
}: MyCodeSpaceProps) => {
  const [innerGitConfig, setInnerGitConfig] = useState(gitConfig);
  const [showCodeSpace, setShowCodeSpace] = useState<boolean>(false);
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
  useEffect(() => {
    CreateModal({
      title: '设置项目信息',
    }).open({
      initialValues: innerGitConfig,
      onSubmit: (values) => {
        setInnerGitConfig(values);
        setShowCodeSpace(true);
      },
      schema: [
        {
          type: 'Input',
          label: '项目拥有着',
          name: 'owner',
        },
        {
          type: 'Input',
          label: '项目名称',
          name: 'repo',
        },
        {
          type: 'Input',
          label: '项目分支',
          name: 'branch',
        },
        {
          type: 'Input',
          label: 'token',
          name: 'token',
          extra: '系统承诺不会对用户token做任何保留',
        },
      ],
    });
  }, []);
  return showCodeSpace ? (
    <div className="my-code-space" style={style}>
      <Sider
        diffLength={0}
        notSaveCount={notSaveCount}
        siderKey={siderKey}
        onClick={siderBarClick}
      />
      <Main
        setNotSaveCount={setNotSaveCount}
        gitConfig={innerGitConfig}
        collapsed={collapsed}
        siderKey={siderKey}
      />
      <Footer
        currentBranch={innerGitConfig.branch}
        waitCommit={0}
        onPush={() => {}}
      />
    </div>
  ) : null;
};
