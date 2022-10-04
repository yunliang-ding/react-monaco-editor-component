import './index.less';

const prefixCls = 'ide-editors-terminal';

export default ({ onClose = () => {}, children }) => {
  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-header`}>
        PROBLEMS
        <i
          className="action-label codicon codicon-panel-close"
          onClick={onClose}
        />
      </div>
      <div className={`${prefixCls}-body`}>{children}</div>
    </div>
  );
};
