/* eslint-disable @typescript-eslint/no-unused-vars */
import { GitManageProps } from './types';
import FileExplorer from '../file-explorer';
import Header from '@/compontent/header';
import CreateSpin from '@/compontent/create-spin';
import { useRef } from 'react';
import { isEmpty } from 'lodash';
import './index.less';

const prefixCls = 'ide-editor-git-manage';

const spin = CreateSpin({
  getContainer: () => document.querySelector(`.${prefixCls}`),
  text: '提交中...',
});

export default ({
  diff,
  onCommit,
  onPush,
  onPull,
  onRefresh,
  onReset,
  onOpenFileChange,
  onSelected,
}: GitManageProps) => {
  const messageRef: any = useRef();
  return (
    <div className={prefixCls}>
      <Header
        title="SOURCE CONTROL"
        actions={[
          {
            icon: 'codicon codicon-check',
            title: 'commit code',
            onClick: async () => {
              try {
                const message = messageRef.current.value;
                if (!isEmpty(message)) {
                  spin.open();
                  await onCommit(message);
                }
              } catch (error) {
                console.log(error);
              } finally {
                spin.close();
              }
            },
          },
          {
            icon: 'codicon codicon-refresh',
            title: 'refresh',
            onClick: onRefresh,
          },
          {
            icon: 'codicon codicon-toolbar-more',
            title: 'more',
          },
        ]}
      />
      <div className={`${prefixCls}-commit`}>
        <input placeholder="请输入提交的备注" autoFocus ref={messageRef} />
      </div>
      <div className={`${prefixCls}-body`}>
        <FileExplorer
          // files={diff}
          header={false}
          onOpenFileChange={onOpenFileChange}
          // onSelected={onSelected}
          onRefresh={() => {}}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};
