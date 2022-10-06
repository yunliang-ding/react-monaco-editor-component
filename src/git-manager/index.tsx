/* eslint-disable @typescript-eslint/no-unused-vars */
import { GitManageProps } from './types';
import FileExplorer, { sleep } from '../file-explorer';
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
  style = {},
  onRefresh,
  explorerRef = useRef<any>({}),
  onClick,
  onOpenFileChange,
  onCommit = sleep,
  onPush = sleep,
  onPull = sleep,
  onReset = sleep,
}: GitManageProps) => {
  const messageRef: any = useRef();
  return (
    <div className={prefixCls} style={style}>
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
                  spin.open({
                    text: '提交中...',
                  });
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
          explorerRef={explorerRef}
          header={false}
          style={{
            width: '100%',
            height: '100%',
          }}
          onOpenFileChange={onOpenFileChange}
          onRefresh={onRefresh}
          onClick={onClick}
          menus={[
            {
              key: 'disCard',
              label: 'DisCard Change',
              onClick({ props }) {
                console.log(props);
              },
            },
            {
              key: 'stage',
              label: 'Stage Change',
              onClick({ props }) {
                console.log(props);
              },
            },
          ]}
        />
      </div>
    </div>
  );
};
