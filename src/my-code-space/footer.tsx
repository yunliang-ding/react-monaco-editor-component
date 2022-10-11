import CreateSpin from '@/compontent/create-spin';

const spin = CreateSpin({
  getContainer: () => document.querySelector('.my-code-space'),
  text: '推送中...',
});

export default ({ currentBranch, waitCommit, onPush }) => {
  return (
    <div className="my-code-space-footer">
      <div className="my-code-space-footer-action">
        <div className="codicon codicon-git-branch" />
        <div>
          {currentBranch}
          {waitCommit?.length > 0 && <sup>*</sup>}
        </div>
      </div>
      <div
        className="my-code-space-footer-action codicon codicon-sync"
        onClick={async () => {
          spin.open();
          await onPush();
          spin.close();
        }}
      />
      {waitCommit?.length > 0 && (
        <span style={{ position: 'relative', left: -4 }}>
          0↓ {waitCommit?.length}↑
        </span>
      )}
    </div>
  );
};
