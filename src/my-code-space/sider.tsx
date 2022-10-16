const prefixCls = 'my-code-space-sider';

export default ({ notSaveCount, diffCount, siderKey, onClick }) => {
  // 侧边栏操作
  const siderList = [
    {
      title: 'Code',
      icon: 'codicon codicon-explorer-view-icon',
    },
    {
      title: 'Search',
      icon: 'codicon codicon-search-view-icon',
    },
    {
      title: 'Git',
      icon: 'codicon codicon-source-control-view-icon',
    },
  ];
  return (
    <div className={prefixCls}>
      {siderList.map((item) => {
        return (
          <div
            title={item.title}
            className={
              siderKey === item.title
                ? `${prefixCls}-item-selected`
                : `${prefixCls}-item`
            }
            key={item.title}
            onClick={() => {
              onClick?.(item.title);
            }}
          >
            <i className={item.icon} />
            {item.title === 'Git' && diffCount > 0 && (
              <span className={`${prefixCls}-item-badge`}>{diffCount}</span>
            )}
            {item.title === 'Code' && notSaveCount > 0 && (
              <span className={`${prefixCls}-item-badge`}>{notSaveCount}</span>
            )}
          </div>
        );
      })}
      <div className="app-setting">
        <div title="用户设置" className={`${prefixCls}-item`}>
          <i className="codicon codicon codicon-accounts-view-bar-icon" />
        </div>
        <div title="系统设置" className={`${prefixCls}-item`}>
          <i className="codicon codicon-settings-view-bar-icon" />
        </div>
      </div>
    </div>
  );
};
