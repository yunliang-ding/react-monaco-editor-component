import CreateSpin from '@/compontent/create-spin';

const spin = CreateSpin({
  getContainer: () => document.querySelector('.my-code-space'),
  text: '推送中...',
});

export default ({ currentBranch, diffCount = 0 }) => {
  return (
    <div className="my-code-space-footer">
      <div className="my-code-space-footer-prefix">
        <span className="codicon codicon-remote" />
        MyCodespace
      </div>
      <div className="my-code-space-footer-action">
        <div className="codicon codicon-git-branch" />
        <div>
          {currentBranch}
          {diffCount > 0 && <sup>&nbsp;*</sup>}
        </div>
      </div>
    </div>
  );
};
